"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, endOfMonth, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "../_components/CreateTransactionDialog";
import { CgProfile } from "react-icons/cg";

// import GameScene from "../../../components/GameScene";
import dynamic from "next/dynamic"; // <-- Import dynamic

const ThreeScene = dynamic(() => import("@/components/game/src/Game"), {
  ssr: false,
});

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  return (
    <>
      <div className="w-full flex justify-end align-middle pl-20 pr-5">
        <div className="w-full flex flex-wrap justify-center">
          <div //HEADER
            className="h-15 w-full flex justify-center align-middle border-b border-[#16425B]"
          >
            <div //HEADER HEADING
              className="h-full w-1/3 flex justify-start items-center"
            >
              <h1 className="text-3xl font-bold" style={{ color: "#16425B" }}>
                Dashboard
              </h1>
            </div>
            <div //DATE RANGE PICKER
              className="h-full w-1/3 flex justify-center align-middle items-center"
            >
              <div
                className="
                    [&_button]:!bg-[#D9DCD6] 
    [&_button]:border
    [&_button]:!border-blue-900
    [&_button]:!text-[#16425B] 
    [&_button]:rounded-full
                "
              >
                {/* Date picker for the income and expense category box */}
                <DateRangePicker
                  initialDateFrom={dateRange.from}
                  initialDateTo={dateRange.to}
                  showCompare={false}
                  onUpdate={(values) => {
                    const { from, to } = values.range;

                    if (!from || !to) return;
                    if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                      toast.error(
                        `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS}`
                      );
                      return;
                    }
                    setDateRange({ from, to });
                  }}
                />
              </div>
            </div>
            <div //USER PROFILE
              className="h-full w-1/3 flex justify-end items-center gap-2 "
              style={{ color: "#16425B" }}
            >
              {" "}
              <h3 className="text-lg font-semibold">
                Hello, <span className="font-bold">User</span>
              </h3>{" "}
              <CgProfile className="w-7 h-7" />{" "}
            </div>
          </div>
          <div className="w-full flex justify-between items-center gap-2 mt-2">
            <div //CATEGORIES
              className="w-2/5 h-full flex flex-wrap items-end justify-between align-middle"
            >
              <CategoriesStats
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
              />
            </div>

            <div //GAME
              className="w-1/3 h-full flex flex-wrap items-end justify-between gap-2 rounded-2xl bg-[#D9DCD6]"
            >
              <ThreeScene />
            </div>

            <div //STATS
              className="w-1/4 h-full flex flex-col items-center justify-center gap-y-1"
            >
              <div className="w-full flex flex-wrap align-middle items-center justify-between">
                <CreateTransactionDialog
                  trigger={
                    <Button
                      variant={"default"}
                      className="w-full lg:w-1/2 border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
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
                      className="w-full lg:w-1/2 border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                    >
                      New Expense
                    </Button>
                  }
                  type="expense"
                />
              </div>
              <StatsCards
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Overview;
