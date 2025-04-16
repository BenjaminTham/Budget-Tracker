import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // const user = "User";

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: "1",
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: "1",
        currency: "USD",
      },
    });
  }

  revalidatePath("/");
  return NextResponse.json(userSettings);
}
