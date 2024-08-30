import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Grid, Typography, Container, Box, Stack, Alert, AlertTitle, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import http from '../../http/index';
import MiLogoPng from '../../assets/image/MiLogoPng.png';
import { useTheme } from '@mui/material/styles';

const SignUpPage: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme(); // Utiliza o hook useTheme para acessar o tema

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const response = await http.post('sign-up/', {
        username,
        email,
        password,
      }, { withCredentials: true });
      if (response.status === 201) {
        setError('');
        navigate('/login/');
      }
    } catch (error) {
      setError('Ocorreu um erro ao criar a conta. Por favor, tente novamente.');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Define a cor do texto com base no modo
      }}
    >
      {showAlert && (
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
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Crie uma conta preenchendo as informações abaixo.
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
          backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#ffffff', // Fundo escuro no modo escuro
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1,
          marginBottom: 10,
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Define a cor do texto com base no modo
        }}
      >
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de usuário"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }, // Cor da label no modo escuro
            }}
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto no modo escuro
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }, // Cor da label no modo escuro
            }}
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto no modo escuro
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }, // Cor da label no modo escuro
            }}
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto no modo escuro
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirme a senha"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }, // Cor da label no modo escuro
            }}
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto no modo escuro
              }
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}>
                {"Já tem uma conta? Faça login"}
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

export default SignUpPage;
