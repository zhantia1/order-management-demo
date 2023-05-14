"use client";
import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface Action {
  text: string;
  action?: () => void;
  icon?: JSX.Element;
}

export interface ActionsMenuProps {
  actions: Action[];
}

export default function ActionsMenu({ actions }: ActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlerWrapper = (cFn?: () => void) => {
    return () => {
      handleClose();
      cFn?.();
    };
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Actions
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.map((a) => (
          <MenuItem
            key={a.text}
            onClick={handlerWrapper(a.action)}
            disableRipple
          >
            {a.icon}
            {a.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
