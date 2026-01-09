'use client';

import { Text } from '@pado/ui';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Text tx="hello" />
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[200px] h-[200px] bg-blue-500"></div>
      </div>
    </div>
  );
}
