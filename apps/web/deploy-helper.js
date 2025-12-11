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

console.log('배포 준비 완료');
