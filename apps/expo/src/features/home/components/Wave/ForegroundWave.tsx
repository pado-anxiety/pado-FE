import { AnimatedProp, Path, PathDef } from '@shopify/react-native-skia';

export default function ForegroundWave({
  path,
  color,
}: {
  path: AnimatedProp<PathDef>;
  color: string;
}): React.ReactNode {
  return (
    <Path
      path={path}
      color={color}
    />
  );
}
