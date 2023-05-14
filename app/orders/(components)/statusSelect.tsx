import { MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { OrderStatus } from "@prisma/client";

export interface OrderStatusSelectProps {
  value: OrderStatus;
  onChange?: (newValue: OrderStatus) => void;
}

const values = [
  OrderStatus.PROCESSING,
  OrderStatus.CANCELLED,
  OrderStatus.DELIVERED,
];

export default function OrderStatusSelect({
  value,
  onChange,
}: OrderStatusSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value as OrderStatus);
  };

  return (
    <TextField select label="Status" value={value} onChange={handleChange}>
      {values.map((v) => (
        <MenuItem key={v} value={v}>
          {v}
        </MenuItem>
      ))}
    </TextField>
  );
}
