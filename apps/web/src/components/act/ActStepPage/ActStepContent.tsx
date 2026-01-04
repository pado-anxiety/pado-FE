'use client';

interface ActStepContentProps {
  children: React.ReactNode;
}

function ActStepContent({ children }: ActStepContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide">
      {children}
    </div>
  );
}

export default ActStepContent;
