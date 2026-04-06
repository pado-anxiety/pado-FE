#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  log,
  logError,
  loadAscEnv,
  generateJWT,
  findLatestReleaseFile,
  parseReleaseYml,
  runCommand,
  getBuilds,
  waitForBuildProcessing,
  createVersion,
  getVersions,
  linkBuild,
  getLocalizations,
  updateLocalization,
  getScreenshotSets,
  submitForReview,
} from './asc-api.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPO_DIR = resolve(__dirname, '..');

export async function runSubmit(buildId, testflight = false) {
  // Step 0: Environment check
  log('Step 0', '환경 확인...');
  if (!existsSync(join(EXPO_DIR, 'eas.json'))) {
    throw new Error(
      'eas.json을 찾을 수 없습니다. 올바른 프로젝트 디렉토리에서 실행하세요.',
    );
  }

  const ascEnvPath = join(EXPO_DIR, '.asc.env');
  const ascEnv = loadAscEnv(ascEnvPath);
  const privateKeyPath = resolve(EXPO_DIR, ascEnv.ASC_PRIVATE_KEY_PATH);
  const appId = ascEnv.ASC_APP_ID;

  const makeToken = () =>
    generateJWT(ascEnv.ASC_KEY_ID, ascEnv.ASC_ISSUER_ID, privateKeyPath);
  let token = makeToken();

  const pkgJson = JSON.parse(
    readFileSync(join(EXPO_DIR, 'package.json'), 'utf8'),
  );
  const version = pkgJson.version;
  log('Step 0', `앱 버전: v${version}, 빌드 ID: ${buildId}`);

  // Snapshot existing ASC builds (for matching after submit)
  const existingBuilds = await getBuilds(token, appId, { version });
  const existingBuildIds = new Set(
    (existingBuilds?.data || []).map((b) => b.id),
  );

  // Step 1: Upload build to App Store Connect
  log('Step 1', 'App Store Connect에 빌드 업로드 중...');
  await runCommand(
    'eas',
    ['submit', '--platform', 'ios', '--id', buildId, '--non-interactive'],
    { cwd: EXPO_DIR },
  );
  log('Step 1', '빌드 업로드 완료');

  // Step 2: Wait for ASC build processing
  token = makeToken();
  const ascBuildId = await waitForBuildProcessing(
    token,
    appId,
    version,
    existingBuildIds,
    makeToken,
  );

  // Step 3: Create version page (409 → use existing)
  token = makeToken();
  log('Step 3', `v${version} 버전 페이지 생성 중...`);
  const versionId = await createVersion(token, appId, version);
  log('Step 3', `버전 페이지 준비 완료 (ID: ${versionId})`);

  // Step 4: Link build to version
  token = makeToken();
  log('Step 4', '빌드 연결 중...');
  await linkBuild(token, versionId, ascBuildId);
  log('Step 4', '빌드 연결 완료');

  // Step 5: Fill release notes from docs/release/
  token = makeToken();
  log('Step 5', '릴리즈 노트 설정 중...');
  const releaseDir = join(EXPO_DIR, 'docs', 'release');
  const releaseFile = findLatestReleaseFile(releaseDir);
  if (!releaseFile) throw new Error('릴리즈 문서를 찾을 수 없습니다.');

  const releaseNotes = parseReleaseYml(join(releaseDir, releaseFile));
  const localizations = await getLocalizations(token, versionId);

  for (const loc of localizations?.data || []) {
    const locale = loc.attributes.locale;
    let whatsNew = null;
    if (locale === 'ko') whatsNew = releaseNotes.ko.whatsNew;
    else if (locale === 'en-US') whatsNew = releaseNotes.en.whatsNew;

    if (whatsNew) {
      await updateLocalization(token, loc.id, { whatsNew });
      log('Step 5', `${locale} 릴리즈 노트 설정 완료`);
    }
  }

  // Step 6: Validate required fields + copy from previous version
  token = makeToken();
  log('Step 6', '필수값 검증 및 이전 버전 데이터 복제 중...');

  const currentLocs = await getLocalizations(token, versionId);

  // Find previous version for field copying
  const allVersions = await getVersions(token, appId);
  const prevVersion = allVersions?.data?.find((v) => v.id !== versionId);

  let prevLocMap = {};
  if (prevVersion) {
    const prevLocs = await getLocalizations(token, prevVersion.id);
    for (const loc of prevLocs?.data || []) {
      prevLocMap[loc.attributes.locale] = loc;
    }
  }

  const COPYABLE = [
    'description',
    'keywords',
    'supportUrl',
    'marketingUrl',
    'promotionalText',
  ];
  const REQUIRED = ['description'];

  for (const loc of currentLocs?.data || []) {
    const locale = loc.attributes.locale;
    const prev = prevLocMap[locale];
    const updates = {};

    for (const field of COPYABLE) {
      if (!loc.attributes[field] && prev?.attributes[field]) {
        updates[field] = prev.attributes[field];
      }
    }

    if (Object.keys(updates).length > 0) {
      await updateLocalization(token, loc.id, updates);
      log(
        'Step 6',
        `${locale}: ${Object.keys(updates).join(', ')} 복제 완료`,
      );
    }

    for (const field of REQUIRED) {
      if (!loc.attributes[field] && !updates[field]) {
        throw new Error(
          `${locale}: ${field}이 비어있고 이전 버전에도 없습니다. ASC에서 직접 입력하세요.`,
        );
      }
    }
  }

  // Check screenshots
  const screenshots = await getScreenshotSets(token, versionId);
  if (screenshots.length === 0) {
    throw new Error(
      '스크린샷이 없습니다. App Store Connect에서 직접 추가하세요.',
    );
  }
  log('Step 6', '필수값 검증 완료');

  // Step 7: Submit for review (skip if testflight)
  if (testflight) {
    log('Step 7', 'TestFlight 모드 — 심사 제출을 건너뜁니다.');
  } else {
    token = makeToken();
    log('Step 7', '심사 제출 중...');
    await submitForReview(token, versionId);
    log('Step 7', '심사 제출 완료');
  }

  // Step 8: Done
  log('Step 8', '✅ 제출 완료');
  log(
    'Step 8',
    `App Store Connect: https://appstoreconnect.apple.com/apps/${appId}/appstore`,
  );

  return { versionId, ascBuildId };
}

// ─── CLI ────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  const buildId = args.find((a) => !a.startsWith('--'));
  const testflight = args.includes('--testflight');

  if (!buildId) {
    console.error('Usage: node ios-submit.mjs <buildId> [--testflight]');
    process.exit(1);
  }

  runSubmit(buildId, testflight).catch((err) => {
    logError('Submit', err.message);
    process.exit(1);
  });
}
