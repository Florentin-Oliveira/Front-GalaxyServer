import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppThemeContext } from '../contexts/ThemeContext';
import NavBar from '../components/NavBar/NavBar';
import Rodape from '../components/Rodape/Rodape';
import MenuVertical from '../components/Menu/Menu';
import { Box } from '@mui/material';

const PrivateLayout = () => {
  const { toggleTheme } = useAppThemeContext();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        overflowX: 'hidden'
      }}
    >
      <NavBar />
      <Box display="flex" flexGrow={1} sx={{ overflowX: 'hidden' }}>
        <MenuVertical />
        <Box 
          flexGrow={1} 
          p={2} 
          sx={{ 
            overflow: 'auto', 
            width: '100%', 
            boxSizing: 'border-box' 
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Rodape />
    </Box>
  );
};

export default PrivateLayout;
