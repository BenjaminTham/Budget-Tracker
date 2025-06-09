"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUtcDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
// import { Button } from ".,/../../components/ui/button";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUtcDate(from)}&to=${DateToUtcDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full h-full flex-wrap md:flex-nowrap justify-evenly gap-2">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );
  return (
    <Card className="h-full w-1/2" style={{ backgroundColor: "#D9DCD6" }}>
      <CardHeader className="p-0">
        <CardTitle
          className="flex justify-start align-middle w-full font-bold pl-2"
          style={{ color: "#16425B" }}
        >
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex item-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div
            className="flex h-full w-full flex-col text-center items-center justify-center font-bold text-xs"
            style={{ color: "#16425B" }}
          >
            No data for the selected period
            {/* <p className="text-xs font-normal">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "income" : "expenses"}
            </p> */}
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full">
            <div className="flex w-full flex-col">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="flex items-center font-bold"
                        style={{ color: "#16425B" }}
                      >
                        {item.categoryIcon} {item.category}{" "}
                        <span className="ml-2 text-xs ">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm " style={{ color: "#16425B" }}>
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
