import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
