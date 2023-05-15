"use client";

import Button from "@/components/mui-components/button";
import { Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCreateRequest } from "@/pages/api/product/create";
import {
  cleanNumber,
  getStringInputFromBENumber,
  validateNumber,
  validateString,
} from "@/utils/formUtils";
import { Product } from "@prisma/client";
import { ProductUpdateRequest } from "@/pages/api/product/update";

export interface ProductFormProps {
  onSubmitSuccess?: (product: Product) => void;
  existingProduct?: Product;
}

export default function ProductForm({
  onSubmitSuccess,
  existingProduct,
}: ProductFormProps) {
  const isUpdating = !!existingProduct;

  const router = useRouter();
  const [name, setName] = useState(existingProduct?.name ?? "");
  const [price, setPrice] = useState(
    getStringInputFromBENumber(existingProduct?.price) ?? "0"
  );
  const [quantity, setQuantity] = useState(
    getStringInputFromBENumber(existingProduct?.quantity) ?? "0"
  );

  const [error, setError] = useState({
    name: false,
    price: false,
    quantity: false,
  });

  const validateProduct = () => {
    if (!validateString(name)) {
      setError((prev) => ({ ...prev, name: true }));
      return false;
    }
    if (!validateNumber(price)) {
      setError((prev) => ({ ...prev, price: true }));
      return false;
    }
    if (!validateNumber(quantity)) {
      setError((prev) => ({ ...prev, quantity: true }));
      return false;
    }
    return true;
  };

  const submitProduct = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // validate
    if (!validateProduct()) {
      return;
    }

    // parse numbers
    let newPrice: number = 0;
    let newQuantity: number = 0;

    // only save up to 2 decimal places
    newPrice = Math.trunc(parseFloat(price) * 100);
    newQuantity = Math.trunc(parseFloat(quantity) * 100);

    // submit
    try {
      let body: ProductUpdateRequest | ProductCreateRequest | undefined;
      let url: string | undefined;

      if (isUpdating) {
        const req: ProductUpdateRequest = {
          id: existingProduct.id,
          name,
          price: newPrice,
          quantity: newQuantity,
        };
        body = req;
        url = "/api/product/update";
      } else {
        const req: ProductCreateRequest = {
          name,
          price: newPrice,
          quantity: newQuantity,
        };
        body = req;
        url = "/api/product/create";
      }
      if (!url || !body) {
        throw new Error("missing necessary values to submit");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const newProduct = await res.json();
      onSubmitSuccess?.(newProduct);
      router.refresh();
      router.push(`/products/${newProduct.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={submitProduct}>
      <Divider>Product Information</Divider>
      <TextField
        label="Product Name"
        required
        value={name}
        error={error.name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Price"
        type="number"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
        value={price}
        error={error.price}
        onChange={(e) => setPrice(cleanNumber(e.target.value))}
      />
      <TextField
        label="Quantity"
        type="number"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
        value={quantity}
        error={error.quantity}
        onChange={(e) => setQuantity(cleanNumber(e.target.value))}
      />
      <Button type="submit">
        {isUpdating ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
