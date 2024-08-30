import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@emotion/react';
import Card from '../components/Cards/CardOS';
import CardCompartilhamento from '../components/Cards/CardCompartilhamento';
import CardOrdemFavoritos from '../components/Cards/CardFavoritos/CardOrdemFavorito';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  animation: `${fadeIn} 1s ease-in-out`,
  marginBottom: '1rem',
};

function App() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Box 
      sx={{ 
        padding: 4, 
        maxWidth: '1500px', 
        margin: '0 auto', 
        marginLeft: '20px' // Move o conteúdo 10px para a esquerda
      }}
    >
      <Box
        sx={{
          marginBottom: 5,
          padding: 2,
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(211, 211, 211, 0.5)'
            : 'rgba(30, 42, 120, 0.5)',
          borderRadius: 5,
          boxShadow: 4
        }}
      >
        <Typography sx={titleStyle}>Minhas Ordens de Serviço</Typography>
        {!loading && <Card />}
      </Box>
      <Box
        sx={{
          marginBottom: 5,
          padding: 2,
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(211, 211, 211, 0.5)'
            : 'rgba(30, 42, 120, 0.5)',
          borderRadius: 5,
          boxShadow: 4
        }}
      >
        <Typography sx={titleStyle}>Minhas Ordens Favoritas</Typography>
        {!loading && <CardOrdemFavoritos />}
      </Box>
      <Box
        sx={{
          marginBottom: 5,
          padding: 2,
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(211, 211, 211, 0.5)'
            : 'rgba(30, 42, 120, 0.5)',
          borderRadius: 5,
          boxShadow: 4
        }}
      >
        <Typography sx={titleStyle}>Compartilhados Comigo</Typography>
        {!loading && <CardCompartilhamento />}
      </Box>
    </Box>
  );
}

export default App;
