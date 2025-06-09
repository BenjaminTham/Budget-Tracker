import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

import Overview from "./_components/Overview";
import History from "./_components/History";

async function page() {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: "1",
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div
      className=" flex flex-col justify-center align-middle items-center bg-[#C4C4C4]"
      // style={{ backgroundColor: "" }}
    >
      <div className="border-b w-full flex justify-center items-center align-middle ">
        {/* Header */}
        {/* <div className="flex flex-row w-5/6 items-center py-8 justify-end">
          <div className="flex items-center gap-3  absolute"></div>
        </div> */}
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
