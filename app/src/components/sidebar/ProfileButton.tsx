import { useTheme } from "@/contexts/ThemeContext";
import useUser from "@/hooks/useUser";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export default function ProfileButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user = useUser();
  const { mode, toggleMode } = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate({ to: "/settings" });
  };

  const handleLogout = () => {
    navigate({ to: "/logout" });
  };

  if (!user) return null;

  return (
    <>
      <button
        id="profile-button"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="flex gap-2 items-center p-4 hover:bg-black/10 cursor-pointer w-full"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <Typography variant="h6" color="white">
              {user.first_name ? user.first_name[0].toUpperCase() : ""}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" />
          Paramètres
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleMode}
                color="primary"
              />
            }
            label={mode === "dark" ? "Mode Clair" : "Mode Sombre"}
            sx={{ ml: 0 }}
          />
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" />
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  );
}
