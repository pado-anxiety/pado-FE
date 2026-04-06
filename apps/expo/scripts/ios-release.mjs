#!/usr/bin/env node

import { fileURLToPath } from 'node:url';

import { log, logError } from './asc-api.mjs';
import { runBuild } from './ios-build.mjs';
import { runSubmit } from './ios-submit.mjs';

async function runRelease(testflight = false) {
  // Build
  log('Release', '=== Build 단계 ===');
  let buildId;
  try {
    buildId = await runBuild('production');
  } catch (err) {
    logError('Release', `빌드 실패: ${err.message}`);
    throw err;
  }

  if (!buildId) {
    log('Release', '빌드가 중단되었습니다.');
    return;
  }

  // Submit
  log('Release', '=== Submit 단계 ===');
  try {
    await runSubmit(buildId, testflight);
  } catch (err) {
    logError('Release', `제출 실패: ${err.message}`);
    logError('Release', `빌드 ID: ${buildId}`);
    logError(
      'Release',
      `수동 재시도: node scripts/ios-submit.mjs ${buildId}${testflight ? ' --testflight' : ''}`,
    );
    throw err;
  }

  log('Release', '✅ 릴리즈 파이프라인 완료');
}

// ─── CLI ────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const testflight = process.argv.includes('--testflight');

  runRelease(testflight).catch(() => {
    process.exit(1);
  });
}

export { runRelease };
