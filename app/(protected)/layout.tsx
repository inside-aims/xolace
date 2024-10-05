import React from "react";

import LeftSidebar from "@/components/shared/LeftSideBar";
import Bottombar from "@/components/shared/Bottombar";
import Topbar from "@/components/shared/Topbar";
import Loader from "@/components/shared/Loader";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />
        <section className=" main-container pt-20">
          <div className=" w-full max-w-4xl px-1">{children}</div>
        </section>
      </main>
      <Bottombar />
    </>
  );
}

{
  /* <Topbar />
<main className='flex flex-row'>
  <LeftSidebar />
  <section className=' main-container' >
    <div className=' w-full max-w-4xl' >
    {children}
    </div>
  </section>
  <RightSidebar />
</main>
<Bottombar /> */
}
