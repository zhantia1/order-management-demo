import ProductNewButton from "./(components)/newButton";
import ListPageLayout from "@/components/listPageLayout/listPageLayout";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListPageLayout title="Products" createNewElement={<ProductNewButton />}>
      {children}
    </ListPageLayout>
  );
}
