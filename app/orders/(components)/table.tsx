"use client";

import { Column, TableWithInfiniteScroll } from "@/components/table/table";
import { Order } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { OrderListRequest } from "@/pages/api/order/list";
import Link from "next/link";
import { getConvertedBENumber } from "@/utils/numberUtils";

const LIMIT = 20;

export interface OrdersTableProps {
  productId?: string;
}

export default function OrdersTable({ productId }: OrdersTableProps) {
  const columns: Column<Order>[] = useMemo(() => {
    return [
      {
        label: "ID",
        cellRenderer: (row) => {
          return <Link href={`/orders/${row.id}`}>{row.id}</Link>;
        },
      },
      {
        label: "Product ID",
        cellRenderer: (row) => {
          return <>{row.productId}</>;
        },
      },
      {
        label: "Quantity",
        cellRenderer: (row) => {
          return <>{getConvertedBENumber(row.quantity)}</>;
        },
      },
      {
        label: "Status",
        cellRenderer: (row) => {
          return <>{row.status}</>;
        },
      },
      {
        label: "Tracking Company",
        cellRenderer: (row) => {
          return <>{row.trackingCompany}</>;
        },
      },
      {
        label: "Tracking Number",
        cellRenderer: (row) => {
          return <>{row.trackingNumber}</>;
        },
      },
    ];
  }, []);

  const loadMoreOrders = useCallback(
    async (offset: number = 0) => {
      const body: OrderListRequest = {
        limit: LIMIT,
        offset,
        productId,
      };

      try {
        const res = await fetch("/api/order/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          cache: "no-cache",
        });
        const result = await res.json();
        return result as Order[];
      } catch (error) {
        console.error(error);
      }
      return [];
    },
    [productId]
  );

  const idGetter = useCallback((item: Order) => {
    return item.id;
  }, []);

  return (
    <div>
      <TableWithInfiniteScroll<Order>
        columns={columns}
        idGetter={idGetter}
        loadMore={loadMoreOrders}
        limit={LIMIT}
      />
    </div>
  );
}
