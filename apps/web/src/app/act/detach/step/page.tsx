'use client';

import { useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { handlePostMessage } from '@/lib';

type UserTextToken = {
  text: string;
  isSelected: boolean;
};

function Step({
  stepIndex,
  textareaRef,
  handleChange,
}: {
  stepIndex: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleChange: () => void;
}) {
  const userText =
    'AI 가 발전하면서 직업을 잃을까봐 불안해. 실제로도 빅테크 기업들은 신입 취업을 막고 있다는데 나도 막히는건 아닐까? 개발자가 되지 못하면 난 어떻게 살아가야 하지? 이게 아니면 나는 할 수 있는게 없는거 같아.';
  const [userTextTokens, setUserTextTokens] = useState<UserTextToken[]>(
    userText.split(' ').map((token) => ({
      text: token,
      isSelected: false,
    })),
  );

  const isDragging = useRef<boolean>(false);
  const selectedMode = useRef<boolean | null>(null); // true=highlight

  const onDraggingStart = () => {
    isDragging.current = true;
  };

  const updateHighlight = (index: number, mode?: boolean) => {
    const t: UserTextToken = userTextTokens[index];

    const m = mode !== null ? mode : !t.isSelected;
    setUserTextTokens((prev: UserTextToken[]) => {
      if (prev[index].isSelected === m) {
        return prev;
      }

      const next = [...prev];
      next[index] = { ...t, isSelected: !!m };
      return next;
    });
  };

  const onDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const target = document.elementFromPoint(
      e.clientX,
      e.clientY,
    ) as HTMLElement;

    if (target && target.dataset.index) {
      const index = parseInt(target.dataset.index);
      if (selectedMode.current === null) {
        selectedMode.current = !userTextTokens[index].isSelected;
      }
      console.log(selectedMode.current);
      updateHighlight(index, selectedMode.current);
    }
  };

  const onDraggingEnd = () => {
    isDragging.current = false;
    selectedMode.current = null;
  };

  if (stepIndex === 0) {
    return (
      <div className="flex flex-1 flex-col w-full gap-2">
        <Text className="text-title-medium">무엇 때문에 불안을 느끼나요?</Text>
        <Text className="text-body-medium">
          불안을 만드는 문장을 있는 그대로 적어보세요. 길어도 괜찮고, 자유롭게
          적어도 좋아요.
        </Text>
        <textarea
          ref={textareaRef}
          className="text-body-medium w-full bg-page overflow-hidden resize-none focus:outline-none focus:ring-0"
          placeholder="무엇 때문에 불안을 느끼는지 자유롭게 적어보세요"
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full gap-2">
      <div>
        <Text className="text-title-medium">적은 문장에서</Text>
        <Text className="text-title-medium">생각을 구분해보세요</Text>
      </div>
      <Text className="text-body-medium">
        사실이 아닌 나의 생각 부분을 터치 또는 드래그 해보세요
      </Text>
      <div
        className="flex flex-row gap-1 flex-wrap"
        onPointerMove={onDragging}
        onPointerUp={onDraggingEnd}
        onPointerDown={onDraggingStart}
        style={{ touchAction: 'none' }}
      >
        {userTextTokens.map(({ text, isSelected }, index) => (
          <Text
            data-index={index}
            key={text}
            className="text-body-medium"
            style={{ backgroundColor: isSelected ? 'yellow' : 'transparent' }}
            onClick={() => updateHighlight(index)}
          >
            {text}
          </Text>
        ))}
      </div>
    </div>
  );
}

export default function DetachStepPage() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleNext = () => {
    if (stepIndex < 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {});
    }
  };

  return (
    <PageLayout className="bg-page">
      <div className="flex flex-col justify-between items-center gap-4">
        <div className="flex flex-row gap-2 w-full justify-between">
          <Button
            size="default"
            text="나가기"
            onClick={() => console.log('나가기')}
          />
          <Button
            size="default"
            text="다음"
            onClick={handleNext}
          />
        </div>
        <div className="flex-1">
          <Step
            stepIndex={stepIndex}
            textareaRef={textareaRef}
            handleChange={handleChange}
          />
        </div>
      </div>
    </PageLayout>
  );
}
