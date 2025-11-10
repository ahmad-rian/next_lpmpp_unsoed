export default function TataUsahaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-0 pb-4 md:py-10">
      <div className="max-w-7xl w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
