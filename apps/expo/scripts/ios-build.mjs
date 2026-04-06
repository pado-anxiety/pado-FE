#!/usr/bin/env node

import { execSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ensureEasSecrets,
  findLatestReleaseFile,
  log,
  logError,
  parseReleaseYml,
  versionFromFilename,
} from './asc-api.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPO_DIR = resolve(__dirname, '..');

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  // Find outermost JSON structure in mixed output
  for (const [open, close] of [
    ['[', ']'],
    ['{', '}'],
  ]) {
    const start = trimmed.indexOf(open);
    const end = trimmed.lastIndexOf(close);
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {}
    }
  }

  throw new Error('JSON을 찾을 수 없습니다');
}

export async function runBuild(profile = 'production') {
  // Step 0: 환경 확인 + EAS Secrets
  log('Step 0', '환경 확인...');
  if (!existsSync(join(EXPO_DIR, 'eas.json'))) {
    throw new Error(
      'eas.json을 찾을 수 없습니다. 올바른 프로젝트 디렉토리에서 실행하세요.',
    );
  }

  const buildEnvPath = join(EXPO_DIR, '.env.build');
  if (existsSync(buildEnvPath)) {
    await ensureEasSecrets(buildEnvPath);
  }

  if (profile === 'production') {
    // P-1: Check release document
    log('P-1', '릴리즈 문서 확인 중...');
    const releaseDir = join(EXPO_DIR, 'docs', 'release');
    const releaseFile = findLatestReleaseFile(releaseDir);

    if (!releaseFile) {
      throw new Error(
        '릴리즈 문서를 찾을 수 없습니다. docs/release/v{version}.yml 파일을 먼저 작성하세요.',
      );
    }

    const releaseVersion = versionFromFilename(releaseFile);
    const releaseNotes = parseReleaseYml(join(releaseDir, releaseFile));

    if (!releaseNotes.ko.whatsNew)
      throw new Error(`${releaseFile}: ko.whatsNew가 비어있습니다.`);
    if (!releaseNotes.en.whatsNew)
      throw new Error(`${releaseFile}: en.whatsNew가 비어있습니다.`);
    log('P-1', `릴리즈 문서 확인 완료: ${releaseFile}`);

    // P-2: Version sync (릴리즈 문서 버전을 source of truth로 사용)
    log('P-2', '버전 동기화 확인 중...');
    const pkgJsonPath = join(EXPO_DIR, 'package.json');
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    const currentVersion = pkgJson.version;

    if (currentVersion !== releaseVersion) {
      log('P-2', `버전 동기화: ${currentVersion} → ${releaseVersion}`);
      pkgJson.version = releaseVersion;
      writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
      execSync('git add package.json', { cwd: EXPO_DIR });
      execSync(`git commit -m "chore: bump version to v${releaseVersion}"`, {
        cwd: EXPO_DIR,
      });
      log('P-2', '버전 업데이트 커밋 완료');
    } else {
      log('P-2', `버전 동일 (v${currentVersion}). 빌드 진행.`);
    }
  }

  // Step 1: Build
  log('Step 1', `eas build 실행 중 (profile: ${profile})...`);

  const buildOutput = await new Promise((resolve, reject) => {
    const child = spawn(
      'eas',
      [
        'build',
        '--profile',
        profile,
        '--platform',
        'ios',
        '--non-interactive',
        '--json',
      ],
      {
        cwd: EXPO_DIR,
        stdio: ['inherit', 'pipe', 'inherit'],
      },
    );

    let stdout = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`eas build 실패 (exit ${code})`));
      else resolve(stdout);
    });
    child.on('error', reject);
  });

  // Parse build ID
  let buildId;
  try {
    const parsed = extractJson(buildOutput);
    const build = Array.isArray(parsed) ? parsed[0] : parsed;
    buildId = build.id;
  } catch {
    // Fallback: query latest build
    log('Step 1', 'JSON 파싱 실패, 최신 빌드를 조회합니다...');
    const list = spawnSync(
      'eas',
      [
        'build:list',
        '--platform',
        'ios',
        '--status',
        'finished',
        '--json',
        '--limit',
        '1',
      ],
      { cwd: EXPO_DIR, encoding: 'utf8' },
    );

    try {
      const builds = JSON.parse(list.stdout.trim());
      buildId = builds[0]?.id;
    } catch {}

    if (!buildId) throw new Error('빌드 ID를 확인할 수 없습니다.');
  }

  // Step 2: Done
  log('Step 2', '✅ 빌드 완료');
  log('Step 2', `빌드 ID: ${buildId}`);
  if (profile === 'production') {
    log('Step 2', `제출하려면: node scripts/ios-submit.mjs ${buildId}`);
  }

  return buildId;
}

// ─── CLI ────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  let profile = 'production';
  if (args.includes('--development')) profile = 'development';
  else if (args.includes('--preview')) profile = 'preview';
  else if (args.includes('--production')) profile = 'production';

  runBuild(profile).catch((err) => {
    logError('Build', err.message);
    process.exit(1);
  });
}
