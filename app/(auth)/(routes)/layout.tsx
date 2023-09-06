export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center jsutify-center h-full">{children}</div>
  );
}
