'use client';

interface ActResultContentProps {
  children: React.ReactNode;
}

function ActResultContent({ children }: ActResultContentProps) {
  return <div className="flex flex-col w-full">{children}</div>;
}

export default ActResultContent;
