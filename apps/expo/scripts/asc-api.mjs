import { createSign } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { spawn } from 'node:child_process';

// ─── Logging ────────────────────────────────────────────

export function log(step, message) {
  console.log(`[${step}] ${message}`);
}

export function logError(step, message) {
  console.error(`[${step}] ❌ ${message}`);
}

// ─── Error ──────────────────────────────────────────────

export class AscApiError extends Error {
  constructor(status, endpoint, responseBody) {
    super(`ASC API ${status} ${endpoint}`);
    this.name = 'AscApiError';
    this.status = status;
    this.endpoint = endpoint;
    this.responseBody = responseBody;
  }
}

// ─── JWT ────────────────────────────────────────────────

export function generateJWT(keyId, issuerId, privateKeyPath) {
  const privateKey = readFileSync(privateKeyPath, 'utf8');
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: issuerId,
    iat: now,
    exp: now + 1200,
    aud: 'appstoreconnect-v1',
  };

  const b64url = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signingInput = `${b64url(header)}.${b64url(payload)}`;

  const sign = createSign('SHA256');
  sign.update(signingInput);
  const signature = sign.sign(
    { key: privateKey, dsaEncoding: 'ieee-p1363' },
    'base64url',
  );

  return `${signingInput}.${signature}`;
}

// ─── ASC API Request ────────────────────────────────────

const ASC_BASE = 'https://api.appstoreconnect.apple.com';

export async function ascRequest(method, endpoint, token, body) {
  const url = `${ASC_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new AscApiError(res.status, endpoint, data);

  return data;
}

// ─── Env Loading ────────────────────────────────────────

export function loadAscEnv(envPath) {
  if (!existsSync(envPath)) {
    throw new Error(`.asc.env 파일이 없습니다: ${envPath}`);
  }

  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }

  const required = [
    'ASC_KEY_ID',
    'ASC_ISSUER_ID',
    'ASC_PRIVATE_KEY_PATH',
    'ASC_APP_ID',
  ];
  for (const key of required) {
    if (!env[key])
      throw new Error(`.asc.env에 ${key}가 없거나 비어있습니다.`);
  }

  return env;
}

// ─── EAS Secrets ────────────────────────────────────────

export function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return {};

  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return env;
}

export async function ensureEasSecrets(buildEnvPath) {
  const buildEnv = loadEnvFile(buildEnvPath);

  const { stdout } = await runCommandCapture('eas', ['secret:list', '--json']);
  let existing = [];
  try {
    existing = JSON.parse(stdout).map((s) => s.name);
  } catch {}

  for (const [name, value] of Object.entries(buildEnv)) {
    if (!value) continue;
    if (existing.includes(name)) {
      log('Secrets', `${name} 이미 등록됨`);
    } else {
      log('Secrets', `${name} 등록 중...`);
      await runCommand('eas', [
        'secret:create',
        '--name',
        name,
        '--value',
        value,
        '--type',
        'string',
        '--scope',
        'project',
        '--non-interactive',
      ]);
      log('Secrets', `${name} 등록 완료`);
    }
  }
}

function runCommandCapture(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: options.cwd,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d;
    });
    child.stderr.on('data', (d) => {
      stderr += d;
    });

    child.on('close', (code) => {
      if (code !== 0) {
        const err = new Error(
          `Command failed: ${cmd} ${args.join(' ')} (exit ${code})`,
        );
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
    child.on('error', reject);
  });
}

// ─── YAML Parser (fixed structure, no deps) ─────────────

export function parseReleaseYml(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const result = { ko: { whatsNew: '' }, en: { whatsNew: '' } };

  let currentLang = null;
  let inWhatsNew = false;
  let whatsNewLines = [];
  let blockIndent = 0;

  for (const line of content.split('\n')) {
    if (line.trimStart().startsWith('#')) continue;

    const langMatch = line.match(/^(ko|en):\s*$/);
    if (langMatch) {
      if (currentLang && whatsNewLines.length > 0) {
        result[currentLang].whatsNew = whatsNewLines.join('\n').trimEnd();
      }
      currentLang = langMatch[1];
      inWhatsNew = false;
      whatsNewLines = [];
      continue;
    }

    if (currentLang && line.match(/^\s+whatsNew:\s*\|\s*$/)) {
      inWhatsNew = true;
      whatsNewLines = [];
      blockIndent = 0;
      continue;
    }

    if (inWhatsNew) {
      if (line.trim() === '') {
        whatsNewLines.push('');
        continue;
      }
      const indent = line.search(/\S/);
      if (blockIndent === 0) blockIndent = indent;
      if (indent >= blockIndent) {
        whatsNewLines.push(line.slice(blockIndent));
      } else {
        inWhatsNew = false;
        if (currentLang) {
          result[currentLang].whatsNew = whatsNewLines.join('\n').trimEnd();
          whatsNewLines = [];
        }
        const langMatch2 = line.match(/^(ko|en):\s*$/);
        if (langMatch2) currentLang = langMatch2[1];
      }
    }
  }

  if (currentLang && whatsNewLines.length > 0) {
    result[currentLang].whatsNew = whatsNewLines.join('\n').trimEnd();
  }

  return result;
}

// ─── Release File Finder ────────────────────────────────

export function findLatestReleaseFile(releaseDir) {
  if (!existsSync(releaseDir)) return null;

  const files = readdirSync(releaseDir)
    .filter((f) => /^v\d+\.\d+\.\d+\.yml$/.test(f))
    .sort((a, b) => {
      const parse = (name) => {
        const m = name.match(/^v(\d+)\.(\d+)\.(\d+)\.yml$/);
        return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
      };
      const [aM, am, ap] = parse(a);
      const [bM, bm, bp] = parse(b);
      return bM - aM || bm - am || bp - ap;
    });

  return files[0] || null;
}

export function versionFromFilename(filename) {
  const m = filename.match(/^v(\d+\.\d+\.\d+)\.yml$/);
  return m ? m[1] : null;
}

// ─── User Prompt ────────────────────────────────────────

export function askYesNo(question) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${question} (Y/n) `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() !== 'n');
    });
  });
}

// ─── Command Runner (spawn wrapper) ─────────────────────

export function runCommand(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: options.stdio || 'inherit',
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    if (child.stdout)
      child.stdout.on('data', (d) => {
        stdout += d;
      });
    if (child.stderr)
      child.stderr.on('data', (d) => {
        stderr += d;
      });

    child.on('close', (code) => {
      if (code !== 0) {
        const err = new Error(
          `Command failed: ${cmd} ${args.join(' ')} (exit ${code})`,
        );
        err.code = code;
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
      } else {
        resolve({ stdout, stderr, code });
      }
    });

    child.on('error', reject);
  });
}

// ─── ASC API Functions ──────────────────────────────────

export async function getBuilds(token, appId, filters = {}) {
  let endpoint = `/v1/builds?filter[app]=${appId}`;
  for (const [key, value] of Object.entries(filters)) {
    endpoint += `&filter[${key}]=${encodeURIComponent(value)}`;
  }
  endpoint += '&sort=-uploadedDate&limit=10';
  return ascRequest('GET', endpoint, token);
}

export async function waitForBuildProcessing(
  token,
  appId,
  version,
  existingBuildIds,
  refreshToken,
) {
  const startTime = Date.now();
  const POLL_INTERVAL = 30_000;
  const WARN_AFTER = 5 * 60_000;
  let warned = false;

  log('Step 2', `ASC 빌드 처리 대기 중 (v${version})...`);

  while (true) {
    const currentToken = refreshToken();
    const data = await getBuilds(currentToken, appId, { version });

    if (data?.data?.length > 0) {
      const newBuilds = data.data.filter(
        (b) => !existingBuildIds.has(b.id),
      );

      if (newBuilds.length > 0) {
        const build = newBuilds[0];
        const state = build.attributes.processingState;

        if (state === 'VALID') {
          log('Step 2', `빌드 처리 완료 (ASC Build ID: ${build.id})`);
          return build.id;
        }
        if (state === 'FAILED' || state === 'INVALID') {
          throw new Error(
            `빌드 처리 실패: processingState=${state}`,
          );
        }
        log(
          'Step 2',
          `processingState: ${state}, ${Math.round((Date.now() - startTime) / 1000)}초 경과...`,
        );
      } else {
        log(
          'Step 2',
          `새 빌드가 아직 ASC에 나타나지 않음, ${Math.round((Date.now() - startTime) / 1000)}초 경과...`,
        );
      }
    } else {
      log(
        'Step 2',
        `ASC에 v${version} 빌드 없음, ${Math.round((Date.now() - startTime) / 1000)}초 경과...`,
      );
    }

    if (!warned && Date.now() - startTime > WARN_AFTER) {
      log(
        'Step 2',
        '⚠️  5분 이상 소요 중. ASC 처리가 지연되고 있습니다.',
      );
      warned = true;
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
}

export async function createVersion(token, appId, versionString) {
  try {
    const data = await ascRequest('POST', '/v1/appStoreVersions', token, {
      data: {
        type: 'appStoreVersions',
        attributes: {
          platform: 'IOS',
          versionString,
          releaseType: 'MANUAL',
        },
        relationships: {
          app: { data: { type: 'apps', id: appId } },
        },
      },
    });
    return data.data.id;
  } catch (err) {
    if (err instanceof AscApiError && err.status === 409) {
      log(
        'Step 3',
        `v${versionString} 버전이 이미 존재합니다. 기존 버전을 사용합니다.`,
      );
      const versions = await getVersions(token, appId, versionString);
      if (versions?.data?.length > 0) return versions.data[0].id;
      throw new Error(
        `기존 버전 v${versionString}을 찾을 수 없습니다.`,
      );
    }
    throw err;
  }
}

export async function getVersions(token, appId, versionString) {
  let endpoint = `/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS`;
  if (versionString)
    endpoint += `&filter[versionString]=${versionString}`;
  endpoint += '&sort=-versionString&limit=5';
  return ascRequest('GET', endpoint, token);
}

export async function linkBuild(token, versionId, ascBuildId) {
  await ascRequest(
    'PATCH',
    `/v1/appStoreVersions/${versionId}/relationships/build`,
    token,
    { data: { type: 'builds', id: ascBuildId } },
  );
}

export async function getLocalizations(token, versionId) {
  return ascRequest(
    'GET',
    `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations`,
    token,
  );
}

export async function updateLocalization(token, localizationId, attributes) {
  return ascRequest(
    'PATCH',
    `/v1/appStoreVersionLocalizations/${localizationId}`,
    token,
    {
      data: {
        type: 'appStoreVersionLocalizations',
        id: localizationId,
        attributes,
      },
    },
  );
}

export async function getScreenshotSets(token, versionId) {
  const localizations = await getLocalizations(token, versionId);
  const allSets = [];
  for (const loc of localizations?.data || []) {
    const sets = await ascRequest(
      'GET',
      `/v1/appStoreVersionLocalizations/${loc.id}/appScreenshotSets`,
      token,
    );
    if (sets?.data?.length > 0) allSets.push(...sets.data);
  }
  return allSets;
}

export async function submitForReview(token, versionId) {
  return ascRequest('POST', '/v1/appStoreVersionSubmissions', token, {
    data: {
      type: 'appStoreVersionSubmissions',
      relationships: {
        appStoreVersion: {
          data: { type: 'appStoreVersions', id: versionId },
        },
      },
    },
  });
}
