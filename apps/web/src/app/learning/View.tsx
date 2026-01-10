'use client';

import { X } from 'lucide-react';

import { Button } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import { LearningStepContent, useLearningStep } from '@/features/learning';

export default function LearningView() {
  const data = window.learningData;
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

  const stepIndicators = Array.from({ length: totalSteps }, (_, i) => ({
    id: `step-${i}`,
    isActive: i === stepIndex,
  }));

  return (
    <PageLayout className="bg-act-page">
      <div className="flex w-full flex-1 flex-col justify-between">
        {/* 상단 헤더 - Exit 버튼만 왼쪽에 */}
        <div className="flex w-full justify-start">
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
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-4 scrollbar-hide">
          {/* 스텝 인디케이터 */}
          <div className="flex w-full items-center justify-center gap-2">
            {stepIndicators.map((indicator) => (
              <div
                key={indicator.id}
                className={`h-2 w-2 rounded-full transition-colors ${
                  indicator.isActive ? 'bg-btn-act-page' : 'bg-neutral-900'
                }`}
              />
            ))}
          </div>

          {/* 스텝 콘텐츠 */}
          <LearningStepContent step={currentStep} />
        </div>

        {/* 하단 버튼 영역 - 뒤로가기, 다음 버튼 나란히 */}
        <div className="flex w-full gap-3 pt-4">
          {!isFirstStep ? (
            <Button
              size="default"
              text="이전"
              onClick={handlePrev}
              className="flex-[0.3] border-2 border-solid border-btn-act-page bg-act-page text-black"
            />
          ) : null}
          <Button
            size="default"
            text={isLastStep ? '완료' : '다음'}
            onClick={handleNext}
            className={`${isFirstStep ? 'flex-1' : 'flex-[0.7]'} bg-btn-act-page`}
          />
        </div>
      </div>
    </PageLayout>
  );
}
