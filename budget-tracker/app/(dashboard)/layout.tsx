import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-row">
      <Navbar />
      <div className="hidden w-full  md:block">{children}</div>
      <div className="flex w-full md:hidden h-full justify-end align-middle items-center bg-red-500">
        Please expand your screen to use
      </div>
    </div>
  );
}

export default layout;
