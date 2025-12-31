type StepProgressProps = {
  stepCount: number;
  currentStepIndex: number;
};

export function StepProgress({
  stepCount,
  currentStepIndex,
}: StepProgressProps) {
  return (
    <div className="flex flex-row gap-2">
      {Array.from({ length: stepCount }).map((_, index) => (
        <div
          key={index}
          className="text-center p-2 rounded-lg bg-primary text-white"
          style={{
            backgroundColor:
              index === currentStepIndex
                ? 'var(--bg-primary)'
                : 'var(--bg-secondary)',
          }}
        >
          icon: {index + 1}
        </div>
      ))}
    </div>
  );
}
