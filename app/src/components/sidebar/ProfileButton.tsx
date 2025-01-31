import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import useUser from '@/hooks/useUser';
import { useTheme } from '@/contexts/ThemeContext';
import { logout as authLogout } from '@/utils/auth';

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

  if (!user) return null;

  return (
    <>
      <Button
        id="profile-button"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        fullWidth
        variant="text"
        sx={{ 
          justifyContent: 'flex-start', 
          textTransform: 'none',
          px: 2,
          py: 1.5
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%' 
        }}>
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 2
            }}
          >
            <Typography variant="h6" color="white">
              {user.name ? user.name[0].toUpperCase() : ''}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <Link to="/settings" className="flex gap-2 items-center">
            <SettingsIcon fontSize="small" />
            Paramètres
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleMode}
                color="primary"
              />
            }
            label={mode === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
            sx={{ ml: 0 }}
          />
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
