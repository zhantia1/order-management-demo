import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface ProductUpdateRequest {
  id: string;
  name: string;
  price?: number;
  quantity?: number;
}

// POST /api/product/update
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, price, quantity, name } = req.body;

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      quantity,
    },
  });
  res.status(200).json(result);
}
