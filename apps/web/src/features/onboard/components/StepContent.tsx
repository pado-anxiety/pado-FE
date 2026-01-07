import { motion } from 'motion/react';

import { Button } from '@pado/ui';

import { FADE_IN_DURATION, FADE_OUT_DURATION } from '../constants';
import type { Step } from '../types';

type StepContentProps = {
  step: Step;
  visibleTexts: number[];
  showButton: boolean;
  isExiting: boolean;
  onNext: () => void;
};

export function StepContent({
  step,
  visibleTexts,
  showButton,
  isExiting,
  onNext,
}: StepContentProps) {
  return (
    <motion.div
      key={step.texts[0]}
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: isExiting ? FADE_OUT_DURATION : FADE_IN_DURATION,
      }}
      className="flex flex-col items-center justify-center w-full gap-8 h-full"
    >
      <div className="flex flex-col items-start w-full flex-1 justify-between">
        <div className="flex flex-col flex-1 items-start justify-center gap-2">
          {step.texts.map((text, index) => {
            const isVisible = visibleTexts.includes(index);
            return (
              <motion.p
                key={`${step.texts[0]}-${text.slice(0, 20)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 20,
                }}
                transition={{ duration: FADE_IN_DURATION }}
                className="text-2xl font-medium leading-relaxed text-white"
              >
                {text}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          key={`btn-${step.texts[0]}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showButton && !isExiting ? 1 : 0,
            y: showButton && !isExiting ? 0 : 20,
          }}
          transition={{ duration: FADE_IN_DURATION }}
          className="w-full"
        >
          <Button
            text={step.buttonText}
            onClick={onNext}
            size="default"
            className="bg-btn-act-page w-full text-lg font-semibold"
            disabled={!showButton || isExiting}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
