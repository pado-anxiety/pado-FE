'use client';

import { useRouter } from 'next/navigation';

import { Button, Text } from '@pado/ui';

export default function AnchorPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push(`/act/anchor/step`);
  };

  return (
    <div className="flex flex-col flex-1 justify-between bg-green-100">
      <div>
        <Text className="text-2xl font-bold text-body">현재에 집중하기</Text>
        <Text className="text-xl text-body">
          현재 불안한 상태이신가요? 불안을 받아들이기 전에 마음을
          진정시켜볼까요? 불안한 마음을 해결하려 애쓰기 전에, 잠시 멈춰서 숨을
          고를 필요가 있어요. 복잡한 머릿속 생각의 전원을 끄고, 지금 이 순간의
          감각만 느껴보세요.
        </Text>
      </div>
      <Button
        size="default"
        text="시작하기"
        onClick={handleStart}
      />
    </div>
  );
}
