"use client";

import Link from "next/link";
import Button from "@/components/mui-components/button";
import { AppBar } from "@mui/material";

export default function NavBar() {
  return (
    <nav>
      <AppBar position="static">
        <Link href="/" style={{ color: "inherit" }}>
          <Button color="inherit">Home</Button>
        </Link>

        <Link href="/products" style={{ color: "inherit" }}>
          <Button color="inherit">Products</Button>
        </Link>

        <Link href="/orders" style={{ color: "inherit" }}>
          <Button color="inherit">Orders</Button>
        </Link>
      </AppBar>
    </nav>
  );
}
