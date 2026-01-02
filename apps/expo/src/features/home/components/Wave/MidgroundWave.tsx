import { AnimatedProp, Path, PathDef } from '@shopify/react-native-skia';

export default function MidgroundWave({
  path,
}: {
  path: AnimatedProp<PathDef>;
}): React.ReactNode {
  return (
    <Path
      path={path}
      color="#3388CC"
    />
  );
}
