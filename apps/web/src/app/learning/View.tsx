'use client';

import { X } from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from '@pado/ui';

import { LearningStepContent, useLearningStep } from '@/features/learning';

export default function LearningView() {
  const data = window.learningData;
  const insets = window.insets;

  const {
    currentStep,
    stepIndex,
    totalSteps,
    isLastStep,
    isFirstStep,
    handleNext,
    handlePrev,
    handleExit,
  } = useLearningStep(data.subject);

  if (!currentStep) {
    return null;
  }

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div
      className="bg-act-page flex-1 flex"
      style={{ paddingTop: insets.top }}
    >
      <div className="flex w-full flex-1 flex-col justify-between">
        {/* 상단 헤더 - Exit 버튼만 왼쪽에 */}
        <div className="flex w-full justify-start  px-8">
          <Button
            size="sm"
            color="link"
            onClick={handleExit}
          >
            <X
              size={30}
              color="black"
            />
          </Button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-4 scrollbar-hide px-8">
          {/* 스텝 콘텐츠 */}
          <LearningStepContent step={currentStep} />
        </div>

        {/* 하단 버튼 영역 - 뒤로가기, 다음 버튼 나란히 */}
        <div
          className="flex w-full flex-col gap-3 pt-4 bg-blue-500 px-8"
          style={{ paddingBottom: insets.bottom }}
        >
          {/* 프로그래스바 */}
          <div className="h-[10px] w-full overflow-hidden rounded-full bg-neutral-300">
            <motion.div
              className="h-full rounded-full bg-btn-act-page"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <div className="flex w-full gap-3">
            {!isFirstStep ? (
              <Button
                size="default"
                text="이전"
                onClick={handlePrev}
                className="flex-[0.3] border-2 border-solid border-btn-act-page bg-blue-500"
              />
            ) : null}
            <Button
              size="default"
              text={isLastStep ? '완료' : '다음'}
              onClick={handleNext}
              className={`${isFirstStep ? 'flex-1' : 'flex-[0.7]'} bg-btn-act-page border-2 border-solid border-btn-act-page`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
