import ListPageLayout from "@/components/listPageLayout/listPageLayout";
import OrderNewButton from "./(components)/newButton";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ListPageLayout title="Orders" createNewElement={<OrderNewButton />}>
      {children}
    </ListPageLayout>
  );
}
