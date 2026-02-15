import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

type ColorScheme = 'light' | 'dark';

export function getOceanColors(colorScheme: ColorScheme) {
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return {
    bgWave: tokens['--ocean-bg-wave'],
    horizon: tokens['--ocean-horizon'],
    midWave: tokens['--ocean-mid-wave'],
    foreWave: tokens['--ocean-fore-wave'],
    frontWave: tokens['--ocean-front-wave'],
    deep: tokens['--ocean-deep'],
    actPath: tokens['--ocean-act-path'],
    actStep: tokens['--ocean-act-step'],
    pathLine: tokens['--ocean-path-line'],
    /** frontWave → deep 6단계 보간 (Skia LinearGradient용) */
    depthGradient: [
      tokens['--ocean-front-wave'],
      tokens['--ocean-depth-1'],
      tokens['--ocean-depth-2'],
      tokens['--ocean-depth-3'],
      tokens['--ocean-depth-4'],
      tokens['--ocean-deep'],
    ],
  };
}

/** Skia/SVG용 — 5개 파도 레이어 컬러 배열 (가까울수록 진함) */
export function getWaveColors(colorScheme: ColorScheme) {
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return [
    tokens['--ocean-bg-wave'], // 0: BackgroundWave (가장 먼 파도, 가장 밝음)
    tokens['--ocean-horizon'], // 1: MidgroundBackWave
    tokens['--ocean-mid-wave'], // 2: MidgroundWave
    tokens['--ocean-fore-wave'], // 3: ForegroundMidWave
    tokens['--ocean-front-wave'], // 4: ForegroundWave (가장 가까운 파도, 가장 진함)
  ] as const;
}
