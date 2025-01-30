import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export default function ProfileButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex gap-2 items-center p-4 hover:bg-black/10 cursor-pointer w-full"
      >
        <AccountCircleIcon />
        Mon Profile
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Link to="/settings" className="flex gap-2 items-center">
            <SettingsIcon fontSize="small" />
            Paramètres
          </Link>
        </MenuItem>

        <MenuItem>
          <Link to="/logout" className="flex gap-2 items-center">
            <Logout fontSize="small" />
            Se déconnecter
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
}
