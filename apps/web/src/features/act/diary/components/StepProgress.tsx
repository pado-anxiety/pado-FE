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
          className="w-4 h-4 rounded-full bg-red-500"
        />
      ))}
    </div>
  );
}
