import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import { getConvertedBENumber } from "@/utils/numberUtils";
import OrderItemActionMenu from "./(components)/actionMenu";
import Link from "next/link";

export const revalidate = 60; // revalidate this page every 60 seconds

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  return order;
}

export interface OrderPageProps {
  params: { id: string };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrder(params.id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>ID: {order?.id}</h1>
        {order && <OrderItemActionMenu order={order} />}
      </div>

      <h2>Status: {order?.status}</h2>
      {order?.productId && (
        <h2>
          Product ID:{" "}
          <Link href={`/products/${order.productId}`}>{order.productId}</Link>
        </h2>
      )}
      <h2>Quantity: {getConvertedBENumber(order?.quantity)}</h2>

      <h2>Tracking Company: {order?.trackingCompany}</h2>
      <h2>Tracking Numer: {order?.trackingNumber}</h2>
    </div>
  );
}
