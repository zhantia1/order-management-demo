"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import {
  CircularProgress,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableContainer,
} from "@mui/material";
import styles from "./table.module.css";

export interface Column<TData extends any> {
  label: string;
  cellRenderer: (row: TData) => JSX.Element;
}
export interface TableWithInfiniteScrollProps<TData extends any> {
  columns: Column<TData>[];
  idGetter: (item: TData) => string;
  loadMore: (offset: number) => Promise<TData[]>;
  limit: number; // this limit must match the same limit used in loadMore
}

export const TableWithInfiniteScroll = <TData extends any>({
  columns,
  loadMore,
  idGetter,
  limit,
}: TableWithInfiniteScrollProps<TData>) => {
  const tableEl = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<Array<TData>>([]);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const res = await loadMore(rows.length);
        if (res.length < limit) {
          setHasMore(false);
        }
        setRows((prevRows) => [...prevRows, ...res]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [rows, limit, loadMore]);

  useEffect(() => {
    if (!loading && hasMore && rows.length === 0) {
      handleLoadMore();
    }
  }, [loading, hasMore, handleLoadMore, rows.length]);

  const scrollListener = useCallback(() => {
    const tableRef = tableEl.current;
    if (tableRef) {
      let bottom = tableRef.scrollHeight - tableRef.clientHeight;

      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.2));
      }
      if (tableRef.scrollTop > bottom - distanceBottom && hasMore && !loading) {
        handleLoadMore();
      }
    }
  }, [hasMore, handleLoadMore, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener("scroll", scrollListener);
    return () => {
      tableRef?.removeEventListener("scroll", scrollListener);
    };
  }, [scrollListener]);

  return (
    <TableContainer
      className={styles.table}
      ref={(instance) => (tableEl.current = instance)}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((c) => {
              return <TableCell key={c.label}>{c.label}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow key={idGetter(row)}>
                {columns.map((c) => {
                  return (
                    <TableCell key={`${idGetter(row)}:${c.label}`}>
                      {c.cellRenderer(row)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {loading && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className={styles.spinnerContainer}>
                  <CircularProgress />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
