import React from 'react';
import { 
  Drawer, 
  Typography, 
  Box 
} from '@mui/material';
import NavLinks from './NavLinks';
import ProfileButton from './ProfileButton';

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            🏦 CodyBank
          </Typography>
          <NavLinks />
        </Box>
        
        <Box sx={{ p: 2 }}>
          <ProfileButton />
        </Box>
      </Box>
    </Drawer>
  );
}
