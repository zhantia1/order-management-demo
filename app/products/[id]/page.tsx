import prisma from "@/lib/prisma";
import ProductItemActionMenu from "./(components)/actionMenu";
import styles from "./page.module.css";
import { getConvertedBENumber } from "@/utils/numberUtils";
import OrdersTable from "@/app/orders/(components)/table";
import { CleanedDivider } from "@/components/mui-components/divider";
import OrderNewButtonText from "@/app/orders/(components)/newButtonText";

export const revalidate = 60; // revalidate this page every 60 seconds

async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  return product;
}

export interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Name: {product?.name}</h1>
        {product && <ProductItemActionMenu product={product} />}
      </div>
      <h2>ID: {product?.id}</h2>
      <h2>Price: {getConvertedBENumber(product?.price)}</h2>
      <h2>Quantity: {getConvertedBENumber(product?.quantity)}</h2>

      <CleanedDivider>
        <h1>Order History</h1>
      </CleanedDivider>

      <OrdersTable productId={params.id} />

      <div className={styles.buttonContainer}>
        <OrderNewButtonText productId={params.id} />
      </div>
    </div>
  );
}
