import React, { useState } from 'react';
import { Button, TextField, Link, Grid, Typography, Container, Box, Stack, Alert, AlertTitle, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import usePost from '../../hook/usePost';
import MiLogoPng from '../../assets/image/MiLogoPng.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { cadastrarDados, sucesso, erro } = usePost();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await cadastrarDados({ url: 'password-reset/', dados: { email } });
    if (sucesso) {
      setAlert({ type: 'success', message: 'Email enviado com sucesso!' });
    } else if (erro) {
      setAlert({ type: 'error', message: 'Erro ao enviar o email. Por favor, tente novamente.' });
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
        sx={{ width: 150, height: 150, mb: 3, marginTop: 10 }}
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
          Esqueceu a senha
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enviar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/login" variant="body2">
                {"Voltar ao login"}
              </Link>
            </Grid>
          </Grid>
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

export default ForgotPasswordPage;
