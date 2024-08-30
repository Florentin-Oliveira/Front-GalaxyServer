import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Stack, CircularProgress, Button, TextField, Alert, AlertTitle, Avatar, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Importando o hook useTheme
import { ICliente } from '../Interface/ICliente';
import { IOS } from '../Interface/IOS';
import http from '../http';
import Card from '../components/Cards/CardOS';
import FavoritoCliente from '../components/Favoritos/FavoritoCliente';

export default function ViewCliente() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme(); // Utilizando o hook useTheme para acessar o tema atual
    const [cliente, setCliente] = useState<ICliente | null>(null);
    const [ordens, setOrdens] = useState<IOS[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        cnpj: ''
    });

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await http.get<ICliente>(`/clientes/${id}/`);
                setCliente(response.data);
                setFormData({
                    id: response.data.id.toString(),
                    nome: response.data.nome,
                    email: response.data.email,
                    telefone: response.data.telefone,
                    cpf: response.data.cpf || '',
                    cnpj: response.data.cnpj || '',
                });
            } catch (error) {
                console.error('Erro ao buscar o cliente:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchOrdens = async () => {
            try {
                const response = await http.get<IOS[]>(`/ordens/?cliente=${id}`);
                setOrdens(response.data);
            } catch (error) {
                console.error('Erro ao buscar as ordens de serviço:', error);
            }
        };

        fetchCliente();
        fetchOrdens();
    }, [id]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await http.put(`/clientes/${id}/`, formData);
            setCliente(response.data);
            setIsEditing(false);
            setAlert({ type: 'success', message: 'Cliente atualizado com sucesso' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Erro ao atualizar o cliente' });
            console.error('Erro ao atualizar o cliente:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await http.delete(`/clientes/${id}/`);
            setAlert({ type: 'success', message: 'Cliente deletado com sucesso' });
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setAlert({ type: 'error', message: 'Erro ao deletar o cliente' });
            console.error('Erro ao deletar o cliente:', error);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    if (!cliente) {
        return <Container><Typography variant="h6">Cliente não encontrado!</Typography></Container>;
    }

    return (
        <Container>
            {alert && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 60,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <Stack sx={{ width: '90%' }} spacing={2}>
                        <Alert severity={alert?.type}>
                            <AlertTitle>{alert?.type === 'success' ? 'Sucesso' : 'Erro'}</AlertTitle>
                            {alert?.message}
                        </Alert>
                    </Stack>
                </Box>
            )}
            <Box sx={{
                mt: 4, p: 2, borderRadius: 2, boxShadow: 3, marginBottom: 3, padding: 2, backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(211, 211, 211, 0.5)'
                    : 'rgba(30, 42, 120, 0.5)',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={cliente.nome}>
                            <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
                                {cliente ? cliente.nome.charAt(0).toUpperCase() : 'C'}
                            </Avatar>
                        </Tooltip>
                        <Typography variant="h4">{cliente.nome}</Typography>
                    </Box>
                    <Tooltip title="Favoritar">
                        <Box>
                            <FavoritoCliente clienteId={cliente.id} onFavoritoChange={() => { }} isFavorito={true} />
                        </Box>
                    </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nome"
                            name="nome"
                            disabled={!isEditing}
                            value={formData.nome}
                            onChange={handleChange}
                            InputLabelProps={{
                                sx: { color: theme.palette.text.primary }
                            }}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            InputLabelProps={{
                                sx: { color: theme.palette.text.primary }
                            }}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Telefone"
                            name="telefone"
                            disabled={!isEditing}
                            value={formData.telefone}
                            onChange={handleChange}
                            InputLabelProps={{
                                sx: { color: theme.palette.text.primary }
                            }}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="CPF"
                            name="cpf"
                            value={formData.cpf}
                            disabled={!isEditing}
                            onChange={handleChange}
                            InputLabelProps={{
                                sx: { color: theme.palette.text.primary }
                            }}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="CNPJ"
                            name="cnpj"
                            value={formData.cnpj}
                            disabled={!isEditing}
                            onChange={handleChange}
                            InputLabelProps={{
                                sx: { color: theme.palette.text.primary }
                            }}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />

                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Box
                            sx={{
                                marginBottom: 6,
                                padding: 3,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(50, 50, 50, 0.7)' : 'rgba(211, 211, 211, 0.5)',
                                borderRadius: 2,
                                boxShadow: 3,
                                height: '500px', // Altura específica do container
                                overflowY: 'auto', // Habilita a rolagem vertical se necessário
                                color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Ajusta a cor do texto para modo escuro/claro
                                '&::-webkit-scrollbar': {
                                    width: '8px', // Largura da barra de rolagem
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#888' : '#bbb', // Cor da barra de rolagem
                                    borderRadius: '4px', // Arredondamento da barra de rolagem
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#888', // Cor da barra de rolagem ao passar o mouse
                                },
                            }}
                        >
                            <Typography variant="h6" component="h2" mb={2}>
                                Ordens de Serviço Relacionadas
                            </Typography>
                            <Card clienteId={parseInt(id!, 10)} />
                        </Box>
                    </Box>

                </Box>

                {!isEditing && (
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: 'center', mt: 2 }}
                    >
                        <Button variant="contained" color="primary" onClick={handleEdit}>Editar</Button>
                        <Button variant="contained" color="secondary" onClick={handleDelete}>Excluir</Button>
                    </Stack>
                )}

                {isEditing && (
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: 'center', mt: 4 }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ borderRadius: '20px' }}
                        >
                            Salvar
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancelEdit}
                            sx={{ borderRadius: '20px' }}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                )}
            </Box>
        </Container>
    );
}
