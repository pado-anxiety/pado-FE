import { useRef } from 'react';

import LottieView from 'lottie-react-native';

export function LoadingSpinner() {
  const animation = useRef(null);

  return (
    <LottieView
      autoPlay
      ref={animation}
      style={{ width: 150, height: 150 }}
      source={require('../../../assets/pado-loading.json')}
    />
  );
}
