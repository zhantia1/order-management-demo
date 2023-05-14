import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export interface OrderUpdateRequest {
  id: string;
  quantity?: number;
  trackingCompany?: string;
  trackingNumber?: string;
}

// POST /api/order/update
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, quantity, trackingCompany, trackingNumber } = req.body;

  const result = await prisma.order.update({
    where: {
      id,
    },
    data: {
      quantity,
      trackingCompany,
      trackingNumber,
    },
  });
  res.status(200).json(result);
}
