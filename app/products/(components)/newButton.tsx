"use client";
import { Fab, Dialog, DialogTitle } from "@mui/material";
import Add from "@mui/icons-material/Add";
import ProductForm from "@/app/products/(components)/form";
import { useState } from "react";

export default function ProductNewButton() {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        onClick={() => setIsOpen(true)}
      >
        <Add />
      </Fab>
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Create New Product</DialogTitle>
        <ProductForm onSubmitSuccess={closeDialog} />
      </Dialog>
    </>
  );
}
