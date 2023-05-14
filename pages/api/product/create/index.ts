import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface ProductCreateRequest {
  name: string;
  price?: number;
  quantity?: number;
}

// POST /api/product/create
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, price, quantity } = req.body;

  const result = await prisma.product.create({
    data: {
      name,
      price,
      quantity,
    },
  });
  res.status(200).json(result);
}
