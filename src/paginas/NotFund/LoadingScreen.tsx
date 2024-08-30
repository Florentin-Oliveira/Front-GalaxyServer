import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f091c, #0f091c, #3E1D91, #FC4590, #3E1D91, #241f4d, #3b74b5)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        flexDirection: 'column',
        color: '#ffffff',
        fontFamily: '"Orbitron", sans-serif', // Fonte futurística
      }}
    >
      <Box
        sx={{
          width: '80px',
          height: '80px',
          border: '8px solid #f3f3f3',
          borderTop: '8px solid #3E1D91', // Cor principal do círculo
          borderRadius: '50%',
          animation: `${spinAnimation} 2s linear infinite`, // Animação de rotação
          marginBottom: '20px',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          letterSpacing: '4px', // Aumenta o espaçamento entre letras
          textTransform: 'uppercase', // Texto em maiúsculas
        }}
      >
        Carregando...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
