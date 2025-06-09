"use client";

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) {
  const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });
  return (
    <div className="flex flex-wrap items-center gap-4 ">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <div
          className="
        /* --- Style for INACTIVE tabs --- */
        /* This sets the default text color for triggers */
        [&_button]:text-gray-600

        /* --- Style for the ACTIVE tab --- */
        /* This specifically targets the trigger when data-state='active' */
        [&_button[data-state=active]]:!bg-[#16425B] 
        [&_button[data-state=active]]:text-white
      "
        >
          <Tabs
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as Timeframe)}
          >
            <TabsList className="text-[#16425B] !bg-[#C8C8C8]">
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px] text-[#16425B] !bg-[#C8C8C8]">
        <SelectValue />
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px] text-[#16425B] !bg-[#C8C8C8]">
        <SelectValue />
        <SelectContent>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const monthStr = new Date(period.year, month, 1).toLocaleString(
              "default",
              { month: "long" }
            );
            return (
              <SelectItem key={month} value={month.toString()}>
                {monthStr}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
}
