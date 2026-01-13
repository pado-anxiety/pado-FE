'use client';

import { Text } from '@pado/ui';

import { Loading } from '@/components/ui';

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Text tx="hello" />
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[200px] h-[200px] bg-blue-500"></div>
      </div>
      <Loading />
    </div>
  );
}
