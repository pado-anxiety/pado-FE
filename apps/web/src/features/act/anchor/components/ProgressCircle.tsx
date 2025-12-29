type ProgressCircleProps = {
  radius: number;
  strokeWidth: number;
  circumference: number;
  offset: number;
  stepIndex: number;
};

export function ProgressCircle({
  radius,
  strokeWidth,
  circumference,
  offset,
  stepIndex,
}: ProgressCircleProps) {
  return (
    <svg
      className="w-full aspect-square overflow-visible absolute top-0 left-0"
      viewBox="0 0 100 100"
    >
      <circle
        key={stepIndex}
        r={radius}
        cx="50"
        cy="50"
        fill="none"
        stroke="blue"
        opacity={0.5}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
      <circle
        r={radius}
        cx="50"
        cy="50"
        fill="none"
        stroke="blue"
        opacity={0.1}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
