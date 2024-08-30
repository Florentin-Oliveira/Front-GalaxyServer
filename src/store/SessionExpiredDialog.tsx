import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import autenticaStore from './autentica.store';

const SessionExpiredDialog: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      if (autenticaStore.sessionExpired && location.pathname !== '/login') {
        console.log('Sessão expirada. Exibindo diálogo.'); 
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleClose = () => {
    console.log('Fechando diálogo e redirecionando para login.'); 
    setOpen(false);
    autenticaStore.sessionExpired = false;
    navigate('/login');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Sessão Expirada</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Sua sessão expirou. Por favor, faça login novamente.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default SessionExpiredDialog;
