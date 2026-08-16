export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4 md:px-8 md:py-8">{children}</div>
  );
}
