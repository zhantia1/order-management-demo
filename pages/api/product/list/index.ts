import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface ProductListRequest {
  limit: number;
  offset: number;
}

// POST /api/product/list
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit, offset } = req.body;

  const result = await prisma.product.findMany({
    take: limit,
    skip: offset,
    orderBy: [{ createdAt: "desc" }],
  });

  res.status(200).json(result);
}
