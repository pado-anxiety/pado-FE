import { AnimatedProp, Path, PathDef } from '@shopify/react-native-skia';

export default function BackgroundWave({
  path,
}: {
  path: AnimatedProp<PathDef>;
}): React.ReactNode {
  return (
    <Path
      path={path}
      color="#D3F3FF"
    />
  );
}
