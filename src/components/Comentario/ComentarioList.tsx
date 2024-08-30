import React, { useEffect, useState } from 'react';
import { IComentario } from '../../Interface/IComentario';
import http from '../../http';
import { Card, CardContent, Typography, Box, IconButton, Collapse, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ComentarioForm from './ComentarioForm';

interface ComentarioListProps {
    ordemId: number;
}

const ComentarioList: React.FC<ComentarioListProps> = ({ ordemId }) => {
    const [comentarios, setComentarios] = useState<IComentario[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComentario, setSelectedComentario] = useState<IComentario | null>(null);
    const theme = useTheme();

    useEffect(() => {
        let isMounted = true;
        const fetchComentarios = async () => {
            try {
                console.log(`Buscando comentários para a ordem ${ordemId}`);
                const response = await http.get<{ count: number, results: IComentario[] }>(`/comentario/?ordemId=${ordemId}`);
                if (isMounted) {
                    console.log(`Comentários recebidos:`, response.data.results);
                    setComentarios(response.data.results.reverse()); // Inverte a ordem dos comentários para mostrar o mais recente primeiro
                }
            } catch (error) {
                console.error('Erro ao buscar comentários:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchComentarios();

        return () => {
            isMounted = false;
        };
    }, [ordemId, refresh]);

    const handleSaveComment = () => {
        setShowForm(false);
        setRefresh(!refresh); // Trigger refresh to update comments list
    };

    const handleOpenDialog = (comentario: IComentario) => {
        setSelectedComentario(comentario);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedComentario(null);
    };

    if (loading) {
        return <div>Carregando comentários...</div>;
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Comentários</Typography>
                <IconButton onClick={() => setShowForm(!showForm)}>
                    <EditIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                </IconButton>
            </Box>

            <Collapse in={showForm}>
                <ComentarioForm ordemId={ordemId} onSave={handleSaveComment} />
            </Collapse>
            {comentarios.map((comentario, index) => (
                <Card
                    key={comentario.id}
                    onClick={() => handleOpenDialog(comentario)} // Abre o modal ao clicar no comentário
                    sx={{
                        mb: 3,
                        marginTop: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    }}
                >
                    <CardContent>
                        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comentario.texto }} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#fff' : 'textSecondary',
                            }}
                        >
                            Por {comentario.usuario.username} em {new Date(comentario.data_comentario).toLocaleDateString()} {new Date(comentario.data_comentario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Comentário: </DialogTitle>
                <DialogContent>
                    {selectedComentario && (
                        <>
                            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: selectedComentario.texto }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#fff' : 'textSecondary',
                                }}
                            >
                                Por {selectedComentario.usuario.username} em {new Date(selectedComentario.data_comentario).toLocaleDateString()} {new Date(selectedComentario.data_comentario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ComentarioList;

