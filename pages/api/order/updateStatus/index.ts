import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { OrderStatus } from "@prisma/client";

export interface OrderUpdateStatusRequest {
  id: string;
  status: OrderStatus;
}

// POST /api/order/updateStatus
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, status } = req.body;

  const result = await prisma.order.update({
    where: {
      id: id,
    },
    data: {
      status,
    },
  });

  // if order is delivered then we can update product with the amount delivered
  if (status === OrderStatus.DELIVERED) {
    // get the order details
    const deliveredOrder = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!deliveredOrder) {
      res.status(500).json({ message: "could not find order" });
      return;
    }

    const prevProduct = await prisma.product.findUnique({
      where: {
        id: deliveredOrder.productId,
      },
    });
    if (!prevProduct) {
      res.status(500).json({ message: "could not find product" });
      return;
    }

    await prisma.product.update({
      where: {
        id: deliveredOrder.productId,
      },
      data: {
        quantity: prevProduct.quantity + deliveredOrder.quantity,
      },
    });
  }

  res.status(200).json(result);
}
