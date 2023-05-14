import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface OrderListRequest {
  limit: number;
  offset: number;
  productId?: string;
}

// POST /api/order/list
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit, offset, productId } = req.body;

  const result = await prisma.order.findMany({
    take: limit,
    skip: offset,
    where: productId ? { productId } : undefined,
    orderBy: [{ createdAt: "desc" }],
  });

  res.status(200).json(result);
}
