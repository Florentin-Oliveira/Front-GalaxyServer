import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Grid, Typography, Container, Box, Stack, Alert, AlertTitle, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import usePost from '../../hook/usePost';
import autenticaStore from '../../store/autentica.store';
import { IUser } from '../../Interface/IUser';
import MiLogoPng from '../../assets/image/MiLogoPng.png';
import LoadingScreen from '../NotFund/LoadingScreen';
import { useTheme } from '@mui/material/styles';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { cadastrarDados, resposta, erro } = usePost();
  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'error'; mensagem: string } | null>(null);

  const navigate = useNavigate();
  const theme = useTheme(); // Utiliza o hook useTheme para acessar o tema

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const userData: Partial<IUser> = { username, password };
    await cadastrarDados({ url: "login/", dados: userData });

    setTimeout(() => {
      setLoading(false);
    }, 3000);

    if (erro) {
      setError('Usuário ou senha incorretos. Por favor, tente novamente.');
      setAlerta({ tipo: 'error', mensagem: 'Usuário ou senha incorretos.' });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resposta?.access && resposta?.id) {
      const expirationTime = Date.now() + 3600 * 1000;
      autenticaStore.login({
        id: resposta.id!,
        username,
        token: resposta.access,
        expirationTime
      });

      setAlerta({ tipo: 'success', mensagem: 'Entrando ...' });
      setTimeout(() => {
        setAlerta(null);
        navigate('/');
      }, 3000);
    } else if (erro) {
      setError('Usuário ou senha incorretos. Por favor, tente novamente.');
      setAlerta({ tipo: 'error', mensagem: 'Usuário ou senha incorretos.' });
    }
  }, [resposta, erro, username, navigate]);

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
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              Insira suas credenciais para fazer login.
            </Alert>
          </Stack>
        </Box>
      )}

      {alerta && (
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
            <Alert severity={alerta.tipo}>
              <AlertTitle>{alerta.tipo === 'error' ? 'Erro' : 'Sucesso'}</AlertTitle>
              {alerta.mensagem}
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
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            InputLabelProps={{
              sx: { color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }, // Cor da label no modo escuro
            }}
            InputProps={{
              sx: {
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Cor do texto no modo escuro
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/sign-up" variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' }}>
                {"Cadastre-se"}
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
      
      {loading && <LoadingScreen />}
    </Container>
  );
};

export default LoginForm;
