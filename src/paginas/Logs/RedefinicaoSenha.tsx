import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Stack, Alert, AlertTitle, Avatar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import usePost from '../../hook/usePost';
import MiLogoPng from '../../assets/image/MiLogoPng.png'

const ResetPasswordConfirmPage: React.FC = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { cadastrarDados, sucesso, erro } = usePost();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'As senhas não coincidem.' });
      return;
    }

    await cadastrarDados({ url: 'password-reset-confirm/', dados: { uidb64, token, new_password: newPassword } });
    if (sucesso) {
      setAlert({ type: 'success', message: 'Senha redefinida com sucesso!' });
      setTimeout(() => navigate('/login'), 3000);
    } else if (erro) {
      setAlert({ type: 'error', message: 'Erro ao redefinir a senha. Por favor, tente novamente.' });
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {alert && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <Stack sx={{ width: '90%' }} spacing={2}>
            <Alert severity={alert.type}>
              <AlertTitle>{alert.type === 'success' ? 'Sucesso' : 'Erro'}</AlertTitle>
              {alert.message}
            </Alert>
          </Stack>
        </Box>
      )}
      <Avatar
        alt="Logo"
        src={MiLogoPng}
        sx={{ width: 150, height: 150, mb: 3, marginTop: 10, }}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1,
          marginBottom: 10,
        }}
      >
        <Typography component="h1" variant="h5">
          Redefinir senha
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="new-password"
            label="Nova Senha"
            name="new-password"
            type="password"
            autoComplete="new-password"
            autoFocus
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm-password"
            label="Confirmar Nova Senha"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Redefinir
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 'auto', pb: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
          Copyright &copy; {new Date().getFullYear()} Thais & Suzy <span>Desenvolvedoras</span>
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
          Projeto Integrador I - <em>2024</em>
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPasswordConfirmPage;
