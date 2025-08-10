import { prisma } from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return (
      Response.json(queryParams.error.message),
      {
        status: 400,
      }
    );
  }

  const stats = await getBalanceStats("1");

  return Response.json(stats);
}

export type GetBalanceStatesResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;
async function getBalanceStats(userId: string) {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
}
