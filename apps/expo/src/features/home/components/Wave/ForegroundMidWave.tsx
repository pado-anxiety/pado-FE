import { AnimatedProp, Path, PathDef } from '@shopify/react-native-skia';

export default function ForegroundMidWave({
  path,
}: {
  path: AnimatedProp<PathDef>;
}): React.ReactNode {
  return (
    <Path
      path={path}
      color="#005599"
    />
  );
}
