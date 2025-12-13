// @ts-check

const MUST_BE_PEER_IN_PACKAGES = [
  // React ecosystem
  'react',
  'react-dom',
  'react-native',

  // i18n
  'i18next',
  'react-i18next',

  // Native 관련
  'nativewind',
  'react-native-css-interop',
  'expo',
];

const SINGLETON_PACKAGES = {
  // Utility libraries
  'tailwind-merge': '^3.4.0',
  zod: '^4.1.13',
  '@hookform/resolvers': '^5.2.2',
};

const DEV_TOOL_PACKAGES = {
  // TypeScript
  typescript: '~5.9.2',

  // Prettier (eslint는 앱마다 다른 config 사용 가능)
  prettier: '^3.7.4',
  '@trivago/prettier-plugin-sort-imports': '^6.0.0',

  // Tailwind CSS
  tailwindcss: '^3.4.17',
  'tailwind-variants': '^3.2.2',
};

module.exports = {
  async constraints({ Yarn }) {
    // 공유 패키지(packages/*)에서는 특정 패키지를 peerDependencies로만 사용
    for (const packageName of MUST_BE_PEER_IN_PACKAGES) {
      for (const dependency of Yarn.dependencies({ ident: packageName })) {
        const workspacePath = dependency.workspace.cwd;

        // packages/ 하위의 공유 패키지인 경우
        if (workspacePath && workspacePath.startsWith('packages/')) {
          // dependencies로 선언된 경우 에러 (devDependencies는 개발용으로 허용)
          if (dependency.type === 'dependencies') {
            dependency.error(
              `Shared package "${dependency.workspace.ident}" should use "${packageName}" as peerDependencies, not dependencies`
            );
          }
        }
      }
    }

    // 싱글톤 패키지 버전 일관성 검사
    for (const [packageName, expectedVersion] of Object.entries(SINGLETON_PACKAGES)) {
      for (const dependency of Yarn.dependencies({ ident: packageName })) {
        if (dependency.type === 'peerDependencies') {
          continue;
        }

        dependency.update(expectedVersion);
      }
    }

    // 개발 도구 버전 일관성 검사
    for (const [packageName, expectedVersion] of Object.entries(DEV_TOOL_PACKAGES)) {
      for (const dependency of Yarn.dependencies({ ident: packageName })) {
        if (dependency.type === 'peerDependencies') {
          continue;
        }

        dependency.update(expectedVersion);
      }
    }

    // 워크스페이스 패키지는 반드시 workspace:* 사용
    for (const dependency of Yarn.dependencies()) {
      if (
        dependency.ident.startsWith('@nyangtodac/') &&
        dependency.range !== 'workspace:*'
      ) {
        dependency.update('workspace:*');
      }
    }

    // 루트 워크스페이스에는 dependencies 금지 (devDependencies만 허용)
    for (const dependency of Yarn.dependencies()) {
      if (
        dependency.workspace.ident === null &&
        dependency.type === 'dependencies'
      ) {
        dependency.delete();
      }
    }
  },
};
