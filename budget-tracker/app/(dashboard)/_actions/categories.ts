"use server";

import { prisma } from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "@/schema/categories";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      userId: "1",
      name,
      icon,
      type,
    },
  });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: "1",
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
}
