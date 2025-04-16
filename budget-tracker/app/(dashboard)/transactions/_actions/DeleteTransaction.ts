"use server";

import { prisma } from "@/lib/prisma";

export async function DeleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: "1",
      id,
    },
  });

  if (!transaction) throw new Error("Bad request");

  await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        id,
        userId: "1",
      },
    }),
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: "1",
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: "1",
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
