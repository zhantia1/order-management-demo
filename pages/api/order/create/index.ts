import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface OrderCreateRequest {
  productId: string;
  quantity: number;
  trackingCompany?: string;
  trackingNumber?: string;
}

// POST /api/order/create
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId, quantity, trackingCompany, trackingNumber } = req.body;

  const result = await prisma.order.create({
    data: {
      productId,
      quantity,
      trackingCompany,
      trackingNumber,
    },
  });
  res.status(200).json(result);
}
