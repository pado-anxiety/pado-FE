export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-1 px-8 py-8 bg-page">{children}</div>;
}
