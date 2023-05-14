"use client";

import { Column, TableWithInfiniteScroll } from "@/components/table/table";
import { Product } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { ProductListRequest } from "@/pages/api/product/list";
import Link from "next/link";
import { getConvertedBENumber } from "@/utils/numberUtils";

const LIMIT = 20;

export default async function ProductsPage() {
  const columns: Column<Product>[] = useMemo(() => {
    return [
      {
        label: "Name",
        cellRenderer: (row) => {
          return <>{row.name}</>;
        },
      },
      {
        label: "ID",
        cellRenderer: (row) => {
          return <Link href={`/products/${row.id}`}>{row.id}</Link>;
        },
      },
      {
        label: "Price",
        cellRenderer: (row) => {
          return <>{getConvertedBENumber(row.price)}</>;
        },
      },
      {
        label: "Quantity",
        cellRenderer: (row) => {
          return <>{getConvertedBENumber(row.quantity)}</>;
        },
      },
    ];
  }, []);

  const loadMoreProducts = useCallback(async (offset: number = 0) => {
    const body: ProductListRequest = {
      limit: LIMIT,
      offset,
    };

    try {
      const res = await fetch("/api/product/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-cache",
      });
      const result = await res.json();
      return result as Product[];
    } catch (error) {
      console.error(error);
    }
    return [];
  }, []);

  const idGetter = useCallback((item: Product) => {
    return item.id;
  }, []);

  return (
    <div>
      <TableWithInfiniteScroll<Product>
        columns={columns}
        idGetter={idGetter}
        loadMore={loadMoreProducts}
        limit={LIMIT}
      />
    </div>
  );
}
