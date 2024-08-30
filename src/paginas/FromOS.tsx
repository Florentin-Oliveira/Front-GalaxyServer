import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Box, Button, MenuItem, Alert, Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import http from '../http/index';
import autenticaStore from '../store/autentica.store';
import { ICliente } from '../Interface/ICliente';

function FormOS() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    data_abertura: '',
    status: 'Novo',
    hardware: '',
    servico: '',
    prioridade: 'Média',
    descricao: '',
    cliente: '',
    user: autenticaStore.usuario.id?.toString() || ''
  });

  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const headers = {
          'Authorization': `Bearer ${autenticaStore.usuario.token}`
        };

        const clientesResponse = await http.get('clientes/', { headers });
        console.log('Clientes recebidos:', clientesResponse.data);
        setClientes(clientesResponse.data.results);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Enviando dados para criar ordem de serviço:', formData);
      const response = await http.post('ordens/', formData, {
        headers: {
          'Authorization': `Bearer ${autenticaStore.usuario.token}`
        }
      });
      console.log('Ordem de Serviço criada:', response.data);

      setSuccess(true);
      setError('');
      setFormData({
        data_abertura: '',
        status: 'Novo',
        hardware: '',
        servico: '',
        prioridade: 'Média',
        descricao: '',
        cliente: '',
        user: autenticaStore.usuario.id?.toString() || ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Erro ao criar Ordem de Serviço:', error);

      setError(error.response?.data?.message || 'Erro ao criar Ordem de Serviço');
      setSuccess(false);

      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ padding: 2, position: 'relative', minHeight: '200px' }}>
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
        marginBottom: 5,
        marginTop: 5,
        padding: 4,
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
        borderRadius: '20px',
        boxShadow: 5,
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        transform: { xs: 'none', md: 'translateX(-30%)' }, // Responsivo
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
          Ordem de Serviço
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Data de Abertura"
            variant="outlined"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
              sx: { color: theme.palette.text.primary },
            }}
            name="data_abertura"
            value={formData.data_abertura}
            onChange={handleChange}
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            margin="normal"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          />
          <TextField
            select
            label="Hardware"
            variant="outlined"
            fullWidth
            margin="normal"
            name="hardware"
            value={formData.hardware}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          >
            <MenuItem value="Computador">Computador</MenuItem>
            <MenuItem value="Impressora">Impressora</MenuItem>
            <MenuItem value="Celular">Celular</MenuItem>
            <MenuItem value="Notebook">Notebook</MenuItem>
            <MenuItem value="Roteador">Roteador</MenuItem>
          </TextField>

          <TextField
            select
            label="Serviço"
            variant="outlined"
            fullWidth
            margin="normal"
            name="servico"
            value={formData.servico}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          >
            <MenuItem value="Formatação">Formatação</MenuItem>
            <MenuItem value="Troca de placa">Troca de placa</MenuItem>
            <MenuItem value="Limpeza">Limpeza</MenuItem>
            <MenuItem value="Atualização de Software">Atualização de Software</MenuItem>
            <MenuItem value="Remoção de vírus">Remoção de vírus</MenuItem>
          </TextField>

          <TextField
            select
            label="Prioridade"
            variant="outlined"
            fullWidth
            margin="normal"
            name="prioridade"
            value={formData.prioridade}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          >
            <MenuItem value="Baixa">Baixa</MenuItem>
            <MenuItem value="Média">Média</MenuItem>
            <MenuItem value="Alta">Alta</MenuItem>
          </TextField>

          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          />
          <TextField
            select
            label="Cliente"
            variant="outlined"
            fullWidth
            margin="normal"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            disabled={isLoading}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary }
            }}
          >
            {isLoading ? (
              <MenuItem disabled>Carregando clientes...</MenuItem>
            ) : (
              clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nenhum cliente cadastrado</MenuItem>
              )
            )}
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{
              borderRadius: '20px', marginTop: 5, marginBottom: 4,
            }}>
              Criar Ordem de Serviço
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default FormOS;
