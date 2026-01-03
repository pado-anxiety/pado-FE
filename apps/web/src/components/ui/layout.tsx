export default function PageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 px-8 py-4 pt-6 ${className} fixed inset-0`}>
      {children}
    </div>
  );
}
