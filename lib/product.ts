import { prisma } from "./prisma";

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      reviews: true,
    },
  });
}