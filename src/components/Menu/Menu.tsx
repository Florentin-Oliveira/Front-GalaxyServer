import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import autenticaStore from '../../store/autentica.store'; 
import http from '../../http/index'; 

const MenuVertical = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = async () => {
    try {
      const token = autenticaStore.usuario.token;
      await http.post('logout/', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      autenticaStore.logout();
      setOpenLogoutDialog(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!isDesktop) {
    return null;
  }

  const menuItems = [
    { text: 'Início', path: '/' },
    { text: 'Perfil', path: '/UserPerfil' },
    { text: 'Criar OS', path: '/FormOS' },
    { text: 'Cadastrar Clientes', path: '/FormCliente' },
    { text: 'Meus Favoritos', path: '/Favoritos' },
    { text: 'Meus Clientes', path: '/Clientes' },
    { text: 'Compartilhados', path: '/CompatilhadosComigo' },
  ];

  return (
    <Box 
      sx={{ 
        width: 300, 
        maxHeight: '65vh', 
        bgcolor: theme.palette.mode === 'dark' ? '#2C2C34' : 'background.paper', 
        color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2C2C34',  
        boxShadow: 5, 
        borderRadius: 4, 
        p: 1,
        m: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden' 
      }}
    > 
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            sx={{
              my: 2,
              color: location.pathname === item.path ? 'darkviolet' : theme.palette.text.primary, // Texto roxo se a rota estiver ativa
              display: 'block',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              mx: 0.1,
              position: 'relative',
              transition: 'color 0.3s, transform 0.3s',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '2px',
                backgroundColor: 'violet',
                bottom: 0,
                left: 0,
                transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)', // Linha roxa se a rota estiver ativa
                transformOrigin: 'left',
                transition: 'transform 0.3s ease-in-out',
              },
              '&:hover:after': {
                transform: 'scaleX(1)', // Expande a linha da esquerda para a direita ao passar o mouse
              },
              '&:hover': {
                color: 'darkviolet', // Altera a cor do texto para roxo escuro ao passar o mouse
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={() => setOpenLogoutDialog(true)}> 
          <ListItemText primary="Sair" />
        </ListItem>
      </List>

      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' }} // Define a cor do texto no modo escuro
        >
          {"Confirmação de Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description"
            sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' }} // Define a cor do texto no modo escuro
          >
            Tem certeza de que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenLogoutDialog(false)} 
            sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' }} // Define a cor do botão no modo escuro
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLogout} 
            autoFocus
            sx={{ color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit' }} // Define a cor do botão no modo escuro
          >
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuVertical;
