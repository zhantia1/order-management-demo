"use client";

import EditIcon from "@mui/icons-material/Edit";
import ActionsMenu from "@/components/actionsMenu/actionsMenu";
import { useState } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { Product } from "@prisma/client";
import ProductForm from "@/app/products/(components)/form";

export interface ProductItemActionMenuProps {
  product: Product;
}

export default function ProductItemActionMenu({
  product,
}: ProductItemActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  const actions = [
    {
      text: "Edit",
      action: () => setIsOpen(true),
      icon: <EditIcon />,
    },
  ];

  return (
    <div>
      <ActionsMenu actions={actions} />
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Update Product: {product.id}</DialogTitle>
        <ProductForm existingProduct={product} onSubmitSuccess={closeDialog} />
      </Dialog>
    </div>
  );
}
