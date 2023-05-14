import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface ProductSearchRequest {
  query: string;
}

// POST /api/product/search
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;

  const result = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  res.status(200).json(result);
}
