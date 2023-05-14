import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface ProductGetRequest {
  id: string;
}

// POST /api/product/get
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;

  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  res.status(200).json(result);
}
