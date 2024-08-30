import React from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import MiLogoPng from '../../assets/image/MiLogoPng.png';
import { useAppThemeContext } from '../../contexts';

const Rodape = () => {
  const { themeName } = useAppThemeContext();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: themeName === 'dark' ? '#2C2C34' : '#f5f5f5',
        color: themeName === 'dark' ? '#ffffff' : '#363e50',
        padding: '1rem 0',
        position: 'relative',
        width: '100%',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        marginTop: 'auto',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Box
          component="img"
          src={MiLogoPng}
          alt="Logo Galaxy Service"
          sx={{ width: 80, height: 'auto', margin: '0 auto' }}
        />
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ marginTop: '0.5rem' }}
        >
          <IconButton
            component="a"
            href="https://gerenciamentov1.vercel.app/"
            aria-label="Facebook"
            sx={{
              color: themeName === 'dark' ? '#ffffff' : '#363e50',
              '&:hover': {
                color: themeName === 'dark' ? '#1976d2' : '#1976d2',
              },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            component="a"
            href="https://gerenciamentov1.vercel.app/"
            aria-label="Instagram"
            sx={{
              color: themeName === 'dark' ? '#ffffff' : '#363e50',
              '&:hover': {
                color: themeName === 'dark' ? '#d81b60' : '#d81b60',
              },
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            component="a"
            href="https://gerenciamentov1.vercel.app/"
            aria-label="LinkedIn"
            sx={{
              color: themeName === 'dark' ? '#ffffff' : '#363e50',
              '&:hover': {
                color: themeName === 'dark' ? '#0a66c2' : '#0a66c2',
              },
            }}
          >
            <LinkedIn />
          </IconButton>
        </Stack>
        <Typography variant="body2" sx={{ marginTop: '1rem' }}>
          Copyright &copy; {new Date().getFullYear()} Thais & Suzy <span>Desenvolvedoras</span>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '0.25rem' }}>
          Projeto Integrador I - <em>2024</em>
        </Typography>
      </Container>
    </Box>
  );
};

export default Rodape;
