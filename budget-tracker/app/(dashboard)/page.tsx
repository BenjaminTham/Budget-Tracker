import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";
import Logo from "@/components/Logo";

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
    <div className=" flex flex-col justify-center align-middle items-center ">
      <div className="border-b w-full flex justify-center items-center align-middle">
        {/* <div className="border-b"> */}
        <div className="flex flex-row w-5/6 items-center py-8 justify-end">
          <div className="w-full ">
            <Logo />
          </div>

          <div className="flex items-center gap-3  absolute">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"default"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New Income
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"default"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New Expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
