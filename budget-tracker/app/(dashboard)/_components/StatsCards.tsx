"use client";

import { GetBalanceStatesResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUtcDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatesResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUtcDate(from)}&to=${DateToUtcDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  //   console.log("income " + income);
  //   console.log("expense " + expense);
  const balance = income - expense;

  return (
    <div className=" flex flex-col w-full gap-2 flex-grow">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 flex-shrink-0 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 flex-shrink-0 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 flex-shrink-0 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  const textColorClass = useMemo(() => {
    if (title === "Income") {
      return "text-emerald-500"; // Green for income
    } else if (title === "Expense") {
      return "text-red-500"; // Red for expense
    } else if (title === "Balance") {
      // You can add logic for balance based on its value (positive/negative)
      // For now, let's assume a default color for balance or make it dynamic
      return value >= 0 ? "text-violet-500" : "text-red-500"; // Violet for positive balance, red for negative
    }
    return ""; // Default if no match
  }, [title, value]); // Added value to dependency array for dynamic balance color

  return (
    // <Card className="flex h-full w-full items-center gap-2 p-4">
    <Card
      className="flex flex-grow h-full w-full items-center gap-2 p-4 lg:flex-row"
      style={{ backgroundColor: "#D9DCD6" }}
    >
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className={`text-2xl font-semibold ${textColorClass}`}
        />
      </div>
    </Card>
  );
}
