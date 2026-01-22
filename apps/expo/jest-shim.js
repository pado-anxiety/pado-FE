// 기본 환경 설정
process.env.NODE_ENV = 'test';

// 타이머 폴리필 (testing-library 호환)
global.setTimeout = global.setTimeout || setTimeout;
global.setInterval = global.setInterval || setInterval;
global.clearTimeout = global.clearTimeout || clearTimeout;
global.clearInterval = global.clearInterval || clearInterval;

// 전역 객체 폴리필
global.location = {
  protocol: 'https:',
  host: 'localhost',
  hostname: 'localhost',
  href: 'https://localhost',
  origin: 'https://localhost',
  port: '8081',
  search: '',
  pathname: '/',
};

global.window = {
  location: global.location,
  navigator: { userAgent: 'node.js' },
  setTimeout: global.setTimeout,
  setInterval: global.setInterval,
  clearTimeout: global.clearTimeout,
  clearInterval: global.clearInterval,
};

if (typeof global.performance === 'undefined') {
  global.performance = { now: () => Date.now() };
}

// requestAnimationFrame 폴리필
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
