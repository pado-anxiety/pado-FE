import Lottie from 'lottie-react';

import loadingJson from '../../../public/pado-loading.json';

export function Loading() {
  return (
    <div style={{ width: 150, height: 150 }}>
      <Lottie
        animationData={loadingJson}
        loop={true}
      />
    </div>
  );
}
