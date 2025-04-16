"use server";

import { prisma } from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) throw parsedBody.error;

  //   const user = "User";
  //   const userId = "1";

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: "1",
    },
    data: {
      currency,
    },
  });

  return userSettings;
}
