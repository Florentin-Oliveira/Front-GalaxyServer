import React, { useEffect, useState } from 'react';
import { IAnexo } from '../../Interface/IAnexo';
import http from '../../http';
import { Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, Link, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, useMediaQuery, useTheme, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface AnexoListProps {
    ordemId: number;
}

const AnexoList: React.FC<AnexoListProps> = ({ ordemId }) => {
    const [anexos, setAnexos] = useState<IAnexo[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAnexo, setSelectedAnexo] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const theme = useTheme();
    const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        let isMounted = true;
        const fetchAnexos = async () => {
            try {
                const response = await http.get<{ count: number, results: IAnexo[] }>(`/anexo/?ordem=${ordemId}`);
                if (isMounted) {
                    setAnexos(response.data.results);
                }
            } catch (error) {
                console.error('Erro ao buscar anexos:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAnexos();

        return () => {
            isMounted = false;
        };
    }, [ordemId]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, anexoId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedAnexo(anexoId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAnexo(null);
    };

    const handleDelete = async () => {
        if (selectedAnexo !== null) {
            try {
                await http.delete(`/anexo/${selectedAnexo}/`);
                setAnexos(anexos.filter(anexo => anexo.id !== selectedAnexo));
                setConfirmDelete(false);
                handleMenuClose();
            } catch (error) {
                console.error('Erro ao excluir anexo:', error);
            }
        }
    };

    const handleSaveAnexo = (anexo: IAnexo) => {
        setAnexos([anexo, ...anexos]); // Adiciona o novo anexo no topo da lista
        setShowForm(false);
    };

    const handleOpenForm = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setArquivo(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('ordem', ordemId.toString());
        if (arquivo) {
            formData.append('arquivo', arquivo);
        }
        try {
            console.log(`Enviando anexo para a ordem ${ordemId}`);
            const response = await http.post<IAnexo>('/anexo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Anexo criado com sucesso:', response.data);
            handleSaveAnexo(response.data);
        } catch (error) {
            console.error('Erro ao criar o anexo:', error);
        }
    };

    if (loading) {
        return <div>Carregando anexos...</div>;
    }

    return (
        <Box
            sx={{
                marginBottom: 3,
                padding: 2,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(50, 50, 50, 0.7)' : 'rgba(211, 211, 211, 0.5)',
                borderRadius: 2,
                boxShadow: 3,
                maxHeight: 300, // Altura máxima do container
                overflowY: 'auto', // Habilita a rolagem vertical
                color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Ajusta a cor do texto para modo escuro/claro
                '&::-webkit-scrollbar': {
                    width: '6px', // Largura da barra de rolagem
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#888' : '#bbb', // Cor da barra de rolagem
                    borderRadius: '10px', // Arredondamento da barra de rolagem
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#888', // Cor da barra de rolagem ao passar o mouse
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Anexos</Typography>
                <IconButton onClick={handleOpenForm}>
                    <AddIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                </IconButton>
            </Box>

            <Dialog open={showForm} onClose={handleCloseForm}>
                <DialogTitle>Adicionar Anexo</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogContentText>
                            Selecione o arquivo para enviar como anexo.
                        </DialogContentText>
                        <TextField
                            fullWidth
                            type="file"
                            variant="outlined"
                            onChange={(e) => setArquivo((e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mt: 2 }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!arquivo}
                    >
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: isMobileOrTablet ? 'center' : 'flex-start' // Centraliza o conteúdo em tablets e celulares
                }}
            >
                {anexos.map((anexo) => {
                    const arquivoURL = new URL(anexo.arquivo, process.env.REACT_APP_API_URL).href;
                    return (
                        <Card
                            key={anexo.id}
                            sx={{
                                width: 130,
                                height: 130,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: '8px',
                                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', // Ajuste do fundo do card para o modo escuro/claro
                                padding: '0px',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <IconButton
                                    size="small"
                                    onClick={(event) => handleMenuOpen(event, anexo.id)}
                                    sx={{ padding: 1 }}
                                >
                                    <MoreVertIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                                </IconButton>
                            </Box>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1, paddingTop: 0, paddingBottom: 0 }}>
                                <AttachmentIcon fontSize="large" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                                <Typography variant="body2" noWrap>
                                    <Link
                                        href={arquivoURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', textDecoration: 'none' }}
                                    >
                                        {anexo.arquivo.split('/').pop()}
                                    </Link>
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        width: '150px',
                    },
                }}
            >
                <MenuItem onClick={() => setConfirmDelete(true)}>
                    <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Excluir
                </MenuItem>
            </Menu>

            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir este anexo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary" sx={{ borderRadius: '20px' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="primary" sx={{ borderRadius: '20px' }}>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AnexoList;
