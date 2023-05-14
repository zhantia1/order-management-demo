"use client";
import { Dialog, DialogTitle, Button } from "@mui/material";
import OrderForm from "@/app/orders/(components)/form";
import { useState } from "react";

export interface OrderNewButtonTextProps {
  productId?: string;
}

export default function OrderNewButtonText({
  productId,
}: OrderNewButtonTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick={() => setIsOpen(true)}
      >
        Create New Order
      </Button>
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Create New Order</DialogTitle>
        <OrderForm
          existingProductId={productId}
          onSubmitSuccess={closeDialog}
        />
      </Dialog>
    </>
  );
}
