"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, endOfMonth, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";
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
      <div className=" w-5/6 ">
        <div className="w-full px-4 flex flex-wrap items-end justify-between gap-2 py-6">
          <StatsCards
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />

          <div className="w-full h-150 mt-1 mb-7 bg-background rounded-2xl flex justify-center items-center">
            {/* <h1>Game here</h1> */}
            <ThreeScene />
          </div>

          <h2 className="text-3xl font-bold flex flex-grow">Overview</h2>
          <div className="flex flex-grow items-center gap-3 justify-end ">
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
        <div className="w-full px-4 flex flex-wrap items-end justify-between gap-2 py-6 ">
          <CategoriesStats
            userSettings={userSettings}
            from={dateRange.from}
            to={dateRange.to}
          />
        </div>
      </div>
    </>
  );
}

export default Overview;
