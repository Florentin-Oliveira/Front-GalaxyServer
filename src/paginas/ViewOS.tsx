import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, useTheme, CircularProgress, Button, Alert, TextField, MenuItem, AlertTitle, Stack, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import ShareIcon from '@mui/icons-material/Share';
import autenticaStore from '../store/autentica.store';
import { IOS } from '../Interface/IOS';
import { ICliente } from '../Interface/ICliente';
import http from '../http';
import RelatorioCSVButton from '../components/Botao CSV/CSV';
import AnexoList from '../components/Anexo/AnexoList';
import ComentarioList from '../components/Comentario/ComentarioList';
import FavoritoOrdem from '../components/Favoritos/FavoritoOrdem';
import Compartilhamento from '../components/Compartilhado/Compartilhamento';
import TotalAvatars from '../components/AvatarMUI/index';

function ViewOS() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [os, setOs] = useState<IOS | null>(null);
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [cliente, setCliente] = useState<ICliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [formData, setFormData] = useState({ id: '', data_abertura: '', hardware: '', servico: '', descricao: '', cliente: '', prioridade: '', status: '', user: autenticaStore.usuario.id?.toString() || '' });
    const [showAnexoForm, setShowAnexoForm] = useState(false);
    const [showComentarioForm, setShowComentarioForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [shareUser, setShareUser] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [permission, setPermission] = useState<string | null>(null);
    const [permissionAlert, setPermissionAlert] = useState<string | null>(null); // Estado para o alerta de permissão
    const theme = useTheme();
    const clienteTooltip = cliente ? cliente.nome : "Cliente não cadastrado por você";
    const [loadingCliente, setLoadingCliente] = useState(true);

    useEffect(() => {
        const fetchOS = async () => {
            try {
                const response = await http.get<IOS>(`/ordens/${id}`);
                setOs(response.data);
                setFormData({
                    id: response.data.id?.toString() || '',
                    data_abertura: response.data.data_abertura || '',
                    hardware: response.data.hardware || '',
                    servico: response.data.servico || '',
                    descricao: response.data.descricao || '',
                    cliente: response.data.cliente?.toString() || '',
                    prioridade: response.data.prioridade || '',
                    status: response.data.status || '',
                    user: autenticaStore.usuario.id?.toString() || ''
                });
                if (response.data.cliente) {
                    const clienteResponse = await http.get<ICliente>(`/clientes/${response.data.cliente}`);
                    setCliente(clienteResponse.data);
                }
                const isCreator = response.data.user === autenticaStore.usuario.id;

                if (isCreator) {
                    setPermission('editor');
                } else {
                    try {
                        const permissionResponse = await http.get(`/compartilhamento/ordem/${id}/permissao/`);
                        setPermission(permissionResponse.data.permissao);

                        switch (permissionResponse.data.permissao) {
                            case 'leitura':
                                setPermissionAlert('Você tem permissão de somente leitura para esta ordem de serviço.');
                                break;
                            case 'comentario':
                                setPermissionAlert('Você pode adicionar comentários, mas não pode editar esta ordem de serviço.');
                                break;
                            case 'editor':
                                setPermissionAlert('Você pode editar esta ordem de serviço.');
                                break;
                            default:
                                setPermissionAlert(null);
                        }
                    } catch (error) {
                        console.error('Erro ao buscar permissões de compartilhamento:', error);
                    }
                }

                if (response.data.cliente) {
                    const clienteResponse = await http.get<ICliente>(`/clientes/${response.data.cliente}`);
                    setCliente(clienteResponse.data);
                }
            } catch (error) {
                console.error('Erro ao buscar a ordem de serviço:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchClientes = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('clientes/', { headers });
                setClientes(response.data.results);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchOS();
        fetchClientes();
    }, [id]);

    useEffect(() => {
        if (alert) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                setAlert(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        if (permissionAlert) {
            const timer = setTimeout(() => {
                setPermissionAlert(null);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [permissionAlert]);

    const handleEdit = () => {
        if (permission === 'editor') {
            setIsEditing(true);
            setShowAnexoForm(true);
            setShowComentarioForm(true);
        } else {
            setAlert({ type: 'error', message: 'Você não tem permissão para editar esta ordem de serviço' });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setShowAnexoForm(false);
        setShowComentarioForm(false);
        if (os) {
            setFormData({
                id: os.id?.toString() || '',
                data_abertura: os.data_abertura || '',
                hardware: os.hardware || '',
                servico: os.servico || '',
                descricao: os.descricao || '',
                cliente: os.cliente?.toString() || '',
                prioridade: os.prioridade || '',
                status: os.status || '',
                user: autenticaStore.usuario.id?.toString() || ''
            });
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (permission !== 'editor') {
            setAlert({ type: 'error', message: 'Você não tem permissão para editar esta ordem de serviço' });
            return;
        }
        if (!formData.cliente) {
            setAlert({ type: 'error', message: 'O cliente deve ser selecionado' });
            return;
        }
        try {
            const response = await http.put(`/ordens/${id}/`, {
                ...formData,
                cliente: formData.cliente || null
            });
            setOs(response.data);
            setIsEditing(false);
            setAlert({ type: 'success', message: 'Ordem de serviço atualizada com sucesso' });
            setTimeout(() => navigate(`/ViewOS/${id}`), 1000);
        } catch (error) {
            setAlert({ type: 'error', message: 'Erro ao atualizar a ordem de serviço' });
        }
    };

    const handleDelete = async () => {
        if (permission !== 'editor') {
            setAlert({ type: 'error', message: 'Você não tem permissão para excluir esta ordem de serviço' });
            return;
        }
        try {
            await http.delete(`/ordens/${id}`);
            setAlert({ type: 'success', message: 'Ordem de serviço deletada com sucesso' });
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setAlert({ type: 'error', message: 'Erro ao deletar a ordem de serviço' });
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleShare = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${autenticaStore.usuario.token}`
            };
            await http.post(`/compartilhar/ordem/${id}/`, { user_id: userId }, { headers });
            setSuccessMessage('Ordem compartilhada com sucesso!');
            handleCloseDialog();
        } catch (error) {
            setErrorMessage('Erro ao compartilhar a ordem.');
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    if (!os) {
        return <Container><Typography variant="h6">Ordem de serviço não encontrada!</Typography></Container>;
    }

    const isStatusFinal = os.status === 'Concluída' || os.status === 'Cancelada';

    return (
        <Container>
            {permissionAlert && (
                <Snackbar open autoHideDuration={10000} onClose={() => setPermissionAlert(null)}>
                    <Alert onClose={() => setPermissionAlert(null)} severity="info">
                        {permissionAlert}
                    </Alert>
                </Snackbar>
            )}
            {showAlert && (
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={clienteTooltip}>
                            <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
                                {cliente ? cliente.nome.charAt(0).toUpperCase() : 'C'}
                            </Avatar>
                        </Tooltip>

                        <Box>
                            <Typography variant="h5" component="h2">{cliente ? cliente.nome : 'Cliente Desconhecido'}</Typography>
                            <Typography>Data: {os.data_abertura ? new Date(os.data_abertura).toLocaleDateString() : 'Data não disponível'}</Typography>
                            <Typography>Número: {os.id}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Favoritar">
                            <Box>
                                <FavoritoOrdem ordemId={os.id} onFavoritoChange={() => { }} isFavorito={true} />
                            </Box>
                        </Tooltip>
                        <Tooltip title="Compartilhar">
                            <IconButton color="default" onClick={handleOpenDialog}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                        <TotalAvatars ordemId={os.id} />
                    </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            select
                            label="Status"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <MenuItem value="Novo">Novo</MenuItem>
                            <MenuItem value="Pendente">Pendente</MenuItem>
                            <MenuItem value="Em andamento">Em andamento</MenuItem>
                            <MenuItem value="Concluída">Concluída</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Tipo de Hardware"
                            margin="normal"
                            name="hardware"
                            value={formData.hardware}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <MenuItem value="Computador">Computador</MenuItem>
                            <MenuItem value="Impressora">Impressora</MenuItem>
                            <MenuItem value="Celular">Celular</MenuItem>
                            <MenuItem value="Notebook">Notebook</MenuItem>
                            <MenuItem value="Roteador">Roteador</MenuItem>
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Tipo de Serviço"
                            margin="normal"
                            name="servico"
                            value={formData.servico}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <MenuItem value="Formatação">Formatação</MenuItem>
                            <MenuItem value="Troca de placa">Troca de placa</MenuItem>
                            <MenuItem value="Limpeza">Limpeza</MenuItem>
                            <MenuItem value="Remoção de vírus">Remoção de vírus</MenuItem>
                            <MenuItem value="Atualização de Software">Atualização de Software</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            margin="normal"
                            multiline
                            label="Descrição do Problema"
                            rows={3}
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Prioridade"
                            margin="normal"
                            name="prioridade"
                            value={formData.prioridade}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <MenuItem value="Baixa">Baixa</MenuItem>
                            <MenuItem value="Média">Média</MenuItem>
                            <MenuItem value="Alta">Alta</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Cliente"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="cliente"
                            value={formData.cliente}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            {clientes.length > 0 && clientes.map((cliente) => (
                                <MenuItem key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <ComentarioList ordemId={os.id} />
                        <AnexoList ordemId={os.id} />
                    </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    {!isEditing && ( // Exibir os botões "Editar", "Excluir" e "Gerar Nota" somente quando não está em modo de edição
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                justifyContent: 'center', // Centraliza os botões
                                marginTop: 4,
                                marginBottom:2,
                            }}
                        >
                            {!isStatusFinal && permission === 'editor' && (
                                <Button variant="contained" color="primary" onClick={handleEdit} sx={{ borderRadius: '20px' }}>Editar</Button>
                            )}
                            {permission === 'editor' && (
                                <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ borderRadius: '20px', }}> Excluir </Button>
                            )}
                            <RelatorioCSVButton ordemId={os.id} />
                        </Stack>
                    )}
                </Box>
                {isEditing && ( // Exibir os botões "Salvar" e "Cancelar" somente quando está em modo de edição
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: 'center', // Centraliza os botões
                            marginTop: 4,
                            marginBottom:2,

                        }}
                    >
                        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ borderRadius: '20px' }}>Salvar</Button>
                        <Button variant="contained" color="secondary" onClick={handleCancelEdit} sx={{ borderRadius: '20px' }}>Cancelar</Button>
                    </Stack>
                )}
            </Box>
            <Compartilhamento ordemId={os.id} open={openDialog} onClose={handleCloseDialog} />
            {successMessage && (
                <Snackbar open autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
                    <Alert onClose={() => setSuccessMessage(null)} severity="success">
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
            {errorMessage && (
                <Snackbar open autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
                    <Alert onClose={() => setErrorMessage(null)} severity="error">
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
}

export default ViewOS;