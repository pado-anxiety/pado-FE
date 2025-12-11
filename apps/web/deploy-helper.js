const fs = require('fs');
const path = require('path');

// 경로 설정
const sourceDir = path.join(__dirname, '.open-next');
const assetsDir = path.join(sourceDir, 'assets');

// 1. assets 폴더 확인
if (!fs.existsSync(assetsDir)) {
  console.error('Error: .open-next/assets 폴더가 없음');
  process.exit(1);
}

// 2. assets 폴더와 worker.js를 제외한 모든 파일/폴더 목록 가져오기
// (cloudflare, server-functions, .build 등 의존성 파일들)
const itemsToMove = fs.readdirSync(sourceDir).filter((item) => {
  return item !== 'assets' && item !== 'worker.js';
});

// 3. 의존성 파일들을 assets 폴더 안으로 이동
itemsToMove.forEach((item) => {
  const srcPath = path.join(sourceDir, item);
  const destPath = path.join(assetsDir, item);

  console.log(` - 이동 중: ${item} -> assets/${item}`);

  // 혹시 이미 존재하면 삭제 후 이동 (덮어쓰기)
  if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true, force: true });
  }
  fs.renameSync(srcPath, destPath);
});

// 4. worker.js를 _worker.js로 이름 바꿔서 assets 안으로 이동
const workerSrc = path.join(sourceDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');

if (fs.existsSync(workerSrc)) {
  console.log('Worker 이동: worker.js -> assets/_worker.js');
  fs.renameSync(workerSrc, workerDest);
} else {
  console.error('Error: worker.js 파일이 없음');
  process.exit(1);
}

// 정적 파일은 워커를 거치지 않고 CDN에서 바로 서빙하도록 설정
const routesJson = {
  version: 1,
  include: ['/*'], // 기본적으로 모든 요청은 워커로 보내되,
  exclude: [
    '/_next/static/*', // CSS, JS, 폰트 등 정적 리소스 제외 (CDN 직통)
    '/favicon.ico', // 파비콘 제외
    '/*.svg', // 루트에 있는 SVG 파일들 제외
    '/*.png', // (필요 시) 이미지 제외
    '/*.jpg',
  ],
};

const routesPath = path.join(assetsDir, '_routes.json');
fs.writeFileSync(routesPath, JSON.stringify(routesJson, null, 2));
console.log('_routes.json 생성 완료');
