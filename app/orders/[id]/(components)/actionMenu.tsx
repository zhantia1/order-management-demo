"use client";

import EditIcon from "@mui/icons-material/Edit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ActionsMenu from "@/components/actionsMenu/actionsMenu";
import { useState } from "react";
import { Dialog, DialogTitle, MenuItem, Select } from "@mui/material";
import { Order, OrderStatus } from "@prisma/client";
import OrderForm from "@/app/orders/(components)/form";
import OrderStatusForm from "../../(components)/statusForm";

export interface OrderItemActionMenuProps {
  order: Order;
}

export default function OrderItemActionMenu({
  order,
}: OrderItemActionMenuProps) {
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  const closeUpdateForm = () => {
    setIsUpdateFormOpen(false);
  };
  const closeUpdateStatus = () => {
    setIsUpdateStatusOpen(false);
  };

  const actions = [
    {
      text: "Edit",
      action: () => setIsUpdateFormOpen(true),
      icon: <EditIcon />,
    },
  ];

  if (order.status === OrderStatus.PROCESSING) {
    actions.push({
      text: "Update Status",
      action: () => setIsUpdateStatusOpen(true),
      icon: <ChangeCircleIcon />,
    });
  }

  return (
    <div>
      <ActionsMenu actions={actions} />
      <Dialog open={isUpdateFormOpen} onClose={closeUpdateForm}>
        <DialogTitle>Update Order: {order.id}</DialogTitle>
        <OrderForm existingOrder={order} onSubmitSuccess={closeUpdateForm} />
      </Dialog>
      <Dialog open={isUpdateStatusOpen} onClose={closeUpdateStatus}>
        <DialogTitle>Update Order Status: {order.id}</DialogTitle>
        <OrderStatusForm
          existingOrder={order}
          onSubmitSuccess={closeUpdateStatus}
        />
      </Dialog>
    </div>
  );
}
