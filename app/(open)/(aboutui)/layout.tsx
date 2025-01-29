import AboutLeftSidebar from "@/components/shared/layoutUIs/AboutLeftSidebar";

export default async function AboutUiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-row bg-black">
      <div className="hidden md:block fixed top-0 h-screen overflow-y-auto">
        <AboutLeftSidebar/>
      </div>
      <div className="flex-1 overflow-y-auto md:pl-[110px] lg:pl-[240px]">
        {children}
      </div>
    </main>
  );
}
