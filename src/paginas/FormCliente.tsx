import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Box, Button, Alert, Slide, FormControlLabel, Checkbox } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import usePost from '../hook/usePost';
import autenticaStore from '../store/autentica.store';
import { ICliente } from '../Interface/ICliente';
import { validarCPF } from '../Validacao/CPF';
import { validarCNPJ } from '../Validacao/CNPJ';

function FormCliente() {
  const theme = useTheme();
  const [clienteData, setClienteData] = useState<Omit<ICliente, 'id'>>({
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const { cadastrarDados, sucesso, erro, resposta } = usePost();
  const [isLoading, setIsLoading] = useState(false);

  const [cpfError, setCpfError] = useState('');
  const [cnpjError, setCnpjError] = useState('');
  const [useCpf, setUseCpf] = useState(true); // Estado para rastrear se CPF ou CNPJ está sendo usado

  useEffect(() => {
    if (sucesso) {
      setSuccess(true);
      setError('');
      setClienteData({ nome: '', cpf: '', cnpj: '', email: '', telefone: '' });
      if (resposta) {
        setClientes(prevClientes => [...prevClientes, resposta as ICliente]);
      }
      setTimeout(() => setSuccess(false), 5000);
    } else if (erro) {
      setSuccess(false);
      setError('Cliente já cadastrado');
      setTimeout(() => setError(''), 5000);
    }
  }, [sucesso, erro, resposta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClienteData({
      ...clienteData,
      [name]: value,
    });

    if (name === 'cpf') setCpfError(''); // Limpa o erro ao digitar no campo
    if (name === 'cnpj') setCnpjError(''); // Limpa o erro ao digitar no campo
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCpfError('');
    setCnpjError('');

    // Validação para CPF ou CNPJ
    if (useCpf && (!clienteData.cpf || !validarCPF(clienteData.cpf))) {
      setCpfError('CPF inválido.');
      return;
    } else if (!useCpf && (!clienteData.cnpj || !validarCNPJ(clienteData.cnpj))) {
      setCnpjError('CNPJ inválido.');
      return;
    }

    const authToken = autenticaStore.usuario.token;

    await cadastrarDados({
      url: 'clientes/',
      dados: clienteData,
      authToken,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 2, position: 'relative', minHeight: '200px' }}>
      {success && (
        <Slide direction="down" in={success} mountOnEnter unmountOnExit>
          <Alert severity="success" sx={{ position: 'absolute', top: 10, left: 0, right: 0, zIndex: 1 }}>
            Cadastrado com sucesso!
          </Alert>
        </Slide>
      )}
      {!success && error && (
        <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
          <Alert severity="error" sx={{ position: 'absolute', top: 10, left: 0, right: 0, zIndex: 1 }}>
            {error}
          </Alert>
        </Slide>
      )}

      <Box sx={{
        marginBottom: 4,
        marginTop: 4,
        padding: 8,
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
        borderRadius: '20px',
        boxShadow: 5,
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        transform: { xs: 'none', md: 'translateX(-30%)' },
      }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: theme.palette.mode === 'dark' ? 'white' : 'black', 
            fontWeight: 'bold',
            textAlign: 'left'
          }}
        >
          Novos Clientes
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            margin="normal"
            name="nome"
            value={clienteData.nome}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          />

          {/* Checkbox para selecionar entre CPF e CNPJ */}
          <FormControlLabel
            control={
              <Checkbox
                checked={useCpf}
                onChange={() => setUseCpf(true)}
                name="useCpf"
              />
            }
            label="Usar CPF"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!useCpf}
                onChange={() => setUseCpf(false)}
                name="useCnpj"
              />
            }
            label="Usar CNPJ"
          />

          {useCpf ? (
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              margin="normal"
              name="cpf"
              value={clienteData.cpf}
              onChange={handleChange}
              error={!!cpfError}
              helperText={cpfError}
              InputLabelProps={{
                sx: { color: theme.palette.text.primary }
              }}
            />
          ) : (
            <TextField
              label="CNPJ"
              variant="outlined"
              fullWidth
              margin="normal"
              name="cnpj"
              value={clienteData.cnpj}
              onChange={handleChange}
              error={!!cnpjError}
              helperText={cnpjError}
              InputLabelProps={{
                sx: { color: theme.palette.text.primary }
              }}
            />
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={clienteData.email}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          />
          <TextField
            label="Telefone"
            variant="outlined"
            fullWidth
            margin="normal"
            name="telefone"
            value={clienteData.telefone}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{
            borderRadius: '20px', marginTop: 5, marginBottom: 4,
          }}>
            Cadastrar Cliente
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default FormCliente;
