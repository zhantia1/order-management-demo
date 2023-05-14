"use client";
import { Button } from "@mui/material";
import OrderStatusSelect from "./statusSelect";
import { useState } from "react";
import { Order, OrderStatus } from "@prisma/client";
import { OrderUpdateStatusRequest } from "@/pages/api/order/updateStatus";
import { useRouter } from "next/navigation";

export interface OrderStatusFormProps {
  existingOrder: Order;
  onSubmitSuccess?: () => void;
}

/**
 * Expected Order Status Flow:
 *
 * OK:
 * PENDING -> DELIVERED -> triggers BE to update underlying product's quantity
 * PENDING -> CANCELED
 *
 * ALL OTHER STATUS CHANGES ARE NOT ALLOWED
 */

export default function OrderStatusForm({
  existingOrder,
  onSubmitSuccess,
}: OrderStatusFormProps) {
  const [status, setStatus] = useState(existingOrder.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // if submitting with status processing then just submit no requests
    if (status === OrderStatus.PROCESSING) {
      onSubmitSuccess?.();
      return;
    }

    // submit
    const body: OrderUpdateStatusRequest = {
      id: existingOrder.id,
      status,
    };
    try {
      setLoading(true);
      await fetch("/api/order/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
      onSubmitSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <OrderStatusSelect value={status} onChange={setStatus} />
      <Button type="submit">{loading ? "Loading..." : "Submit"}</Button>
    </form>
  );
}
