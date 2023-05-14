"use client";

import Button from "@/components/mui-components/button";
import { Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductSelect from "@/app/products/(components)/select";
import { OrderCreateRequest } from "@/pages/api/order/create";
import {
  cleanNumber,
  getStringInputFromBENumber,
  validateNumber,
  validateString,
} from "@/utils/formUtils";
import { Order } from "@prisma/client";
import { OrderUpdateRequest } from "@/pages/api/order/update";

export interface OrderCreateFormProps {
  onSubmitSuccess?: (order: Order) => void;
  existingOrder?: Order;
  existingProductId?: string;
}

export default function OrderForm({
  onSubmitSuccess,
  existingOrder,
  existingProductId,
}: OrderCreateFormProps) {
  const isUpdating = !!existingOrder;
  const router = useRouter();
  const [productId, setProductId] = useState(
    existingOrder?.productId ?? existingProductId ?? ""
  );
  const [quantity, setQuantity] = useState(
    getStringInputFromBENumber(existingOrder?.quantity) ?? "0"
  );
  const [trackingCompany, setTrackingCompany] = useState(
    existingOrder?.trackingCompany ?? ""
  );
  const [trackingNumber, setTrackingNumber] = useState(
    existingOrder?.trackingNumber ?? ""
  );

  const [error, setError] = useState({
    productId: false,
    quantity: false,
  });

  const handleProductSelectChange = (pID: string | null) => {
    setProductId(pID ?? "");
  };

  const validateOrder = () => {
    if (!validateString(productId)) {
      setError((prev) => ({ ...prev, productId: true }));
      return false;
    }
    if (!validateNumber(quantity)) {
      setError((prev) => ({ ...prev, quantity: true }));
      return false;
    }
    return true;
  };

  const submitOrder = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // validate
    if (!validateOrder()) {
      return;
    }

    // parse numbers
    let newQuantity: number = 0;

    // only save up to 2 decimal places
    newQuantity = Math.trunc(parseFloat(quantity) * 100);

    // submit
    try {
      let body: OrderUpdateRequest | OrderCreateRequest | undefined;
      let url: string | undefined;

      if (isUpdating) {
        const req: OrderUpdateRequest = {
          id: existingOrder.id,
          quantity: newQuantity,
          trackingCompany,
          trackingNumber,
        };
        body = req;
        url = "/api/order/update";
      } else {
        const req: OrderCreateRequest = {
          productId,
          quantity: newQuantity,
          trackingCompany,
          trackingNumber,
        };
        body = req;
        url = "/api/order/create";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const newOrder = await res.json();
      router.push(`/orders/${newOrder.id}`);
      onSubmitSuccess?.(newOrder);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={submitOrder}>
      <Divider>Product Information</Divider>
      <ProductSelect
        idValue={productId}
        onIDChange={handleProductSelectChange}
        disabled={isUpdating || !!existingProductId}
      />
      <TextField
        label="Quantity"
        type="number"
        required
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
        value={quantity}
        error={error.quantity}
        onChange={(e) => setQuantity(cleanNumber(e.target.value))}
      />
      <Divider>Shipping Information</Divider>
      <TextField
        label="Tracking Company"
        value={trackingCompany}
        onChange={(e) => setTrackingCompany(e.target.value)}
      />
      <TextField
        label="Tracking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button type="submit">
        {isUpdating ? "Update Order" : "Create Order"}
      </Button>
    </form>
  );
}
