import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Button, Stack, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Snackbar, Alert } from '@mui/material';
import autenticaStore from '../store/autentica.store';
import http from '../http';
import { IUser } from '../Interface/IUser';

export default function UserPerfil() {
  const navigate = useNavigate();
  const user: IUser = autenticaStore.usuario;

  const [formData, setFormData] = useState<{
    id: number | undefined;
    username: string;
    email: string | undefined;
    password: string;
  }>({
    id: user.id,
    username: user.username,
    email: user.email ?? '',  // Certifique-se de que `user.email` está vindo corretamente
    password: '',
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email ?? '',  // Certifique-se que `user.email` está vindo corretamente
      password: '',
    });
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleCancel = () => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email ?? '',
      password: '',
    });
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError(null);
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleSave = async () => {
    if (isEditing) {
      try {
        const response = await http.put(`/users/${formData.id}/`, { username: formData.username, email: formData.email });
        autenticaStore.usuario = { ...user, username: response.data.username, email: response.data.email };
        setIsEditing(false);
      } catch (error: any) {
        setPasswordError('Error saving user info. Please check the details and try again.');
      }
    } else if (isChangingPassword) {
      handleChangePassword();
    }
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError('The new passwords do not match.');
      return;
    }

    const payload = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await http.post(`/password-change/`, payload);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordError(null);
      setIsChangingPassword(false);
    } catch (error: any) {
      setPasswordError('Error changing password. Please check if the current password is correct.');
    }
  };

  const handleDelete = async () => {
    try {
      await http.delete(`/users/${formData.id}/`);
      autenticaStore.logout();
      setOpenDeleteDialog(false);
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 4,
        borderRadius: 5,
        boxShadow: 5,
        marginTop: 2,
        maxWidth: '600px',
        width: '100%',
        margin: '20px auto',
        transform: { xs: 'none', md: 'translateX(-30%)' }, // Responsivo
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt={formData.username} sx={{ width: 56, height: 56 }}>
          {formData.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5">{formData.username}</Typography>
          <Typography variant="body1">{formData.email}</Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ marginTop: 4 }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">Meus dados</Typography>
          <TextField
            name="username"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            disabled={!isEditing}
          />
          <TextField
            label="E-mail"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            disabled={!isEditing}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6">Alterar senha</Typography>
          <TextField
            label="Senha Atual"
            variant="outlined"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            fullWidth
            disabled={!isChangingPassword}
          />
          <TextField
            label="Nova Senha"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            fullWidth
            disabled={!isChangingPassword}
          />
          <TextField
            label="Confirmação de Nova Senha"
            variant="outlined"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            fullWidth
            disabled={!isChangingPassword}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ marginTop: 2, justifyContent: 'center', borderRadius: '20px' }}>
        {isEditing || isChangingPassword ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ borderRadius: '20px' }}>Salvar</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ borderRadius: '20px' }}>Cancelar</Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ borderRadius: '20px' }}>Editar</Button>
            <Button variant="contained" color="primary" onClick={handleChangePasswordClick} sx={{ borderRadius: '20px' }}>Alterar senha</Button>
            <Button variant="contained" color="error" onClick={handleOpenDeleteDialog} sx={{ borderRadius: '20px' }}>Excluir</Button>
          </>
        )}
        {passwordError && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {passwordError}
          </Typography>
        )}
      </Stack>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja excluir sua conta {formData.username}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteDialog}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!passwordError} autoHideDuration={6000} onClose={() => setPasswordError(null)}>
        <Alert onClose={() => setPasswordError(null)} severity="error" sx={{ width: '100%' }}>
          {passwordError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
