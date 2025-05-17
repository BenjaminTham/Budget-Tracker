"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, endOfMonth, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

function TransactionsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  return (
    <>
      <div className="border-b w-full  flex items-center justify-center bg-background ">
        <div className="w-5/6 flex flex-wrap items-center justify-between gap-6 py-8  ">
          <p className="text-3xl font-bold">Transactions history</p>
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
              console.log(to);
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>

      <div className="w-full flex justify-center gap-2 py-6 px-4">
        <div className="w-5/6">
          <TransactionTable from={dateRange.from} to={dateRange.to} />
        </div>
      </div>
    </>
  );
}

export default TransactionsPage;
