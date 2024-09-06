import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Card as MuiCard, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions, Skeleton, IconButton, Menu, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import { ICompartilhamento } from '../../../Interface/ICompatilhamento';
import autenticaStore from '../../../store/autentica.store';

import Univerce from '../../../assets/image/Univerce.png';
import Space from '../../../assets/image/Space.png';
import Fantasma from '../../../assets/image/Fantasma.png';
import Dinossauro from '../../../assets/image/Dinossauro.png';

const images = [Univerce, Space, Fantasma, Dinossauro];

const CardCompartilhamento: React.FC = () => {
    const [compartilharList, setCompartilharList] = useState<ICompartilhamento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCompartilhar, setSelectedCompartilhar] = useState<ICompartilhamento | null>(null);
    const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [permissions, setPermissions] = useState({
        leitura: true,
        comentarios: false,
        editor: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCompartilharList() {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('/compartilhamento', { headers });

                // Filtrar apenas os compartilhamentos recebidos pelo usuário atual
                const compartilhamentosRecebidos = response.data.results.filter((compartilhar: ICompartilhamento) =>
                    compartilhar.usuario_destino === autenticaStore.usuario.id
                );

                setCompartilharList(compartilhamentosRecebidos);
            } catch (error) {
                console.error('Erro ao buscar compartilhados:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCompartilharList();
    }, []);

    const handleNavigate = (id: number) => {
        navigate(`/ViewOS/${id}`);
    };

    const handleDialogOpen = (os: ICompartilhamento) => {
        setSelectedCompartilhar(os);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedCompartilhar(null);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, compartilhar: ICompartilhamento) => {
        setSelectedCompartilhar(compartilhar);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePermissions = () => {
        setPermissionsDialogOpen(true);
        handleMenuClose();
    };

    const handleRemoveShare = async () => {
        if (selectedCompartilhar) {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                await http.delete(`/compartilhamento/${selectedCompartilhar.id}/`, { headers });
                setCompartilharList(prev => prev.filter(item => item.id !== selectedCompartilhar.id));
                console.log('Compartilhamento removido com sucesso');
            } catch (error) {
                console.error('Erro ao remover compartilhamento:', error);
            }
            handleMenuClose();
        }
    };

    const handlePermissionsDialogClose = async () => {
        if (selectedCompartilhar) {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                await http.patch(`/compartilhamento/${selectedCompartilhar.id}/permissoes`, permissions, { headers });
                console.log('Permissões atualizadas com sucesso');
            } catch (error) {
                console.error('Erro ao atualizar permissões:', error);
            }
        }
        setPermissionsDialogOpen(false);
    };

    const handlePermissionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPermissions({
            ...permissions,
            [event.target.name]: event.target.checked,
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {compartilharList.length === 0 ? (
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
                    Nenhum item compartilhado foi encontrado!
                </Typography>
            ) : (
                compartilharList.map((compartilhar, index) => (
                    <Grid item key={compartilhar.id} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <MuiCard
                            sx={{
                                width: { xs: 250, sm: 250 }, // Aumente a largura do card
                                maxWidth: { xs: 300, sm: 350 }, // Aumente a largura máxima do card
                                m: 1,
                                position: 'relative',
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                margin: '0px',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: { xs: 100, sm: 125 },
                                    flexShrink: 0,
                                    borderRadius: '16px 16px 0 0',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={images[index % images.length]}
                                    alt="Space"
                                    width="100%"
                                    height="100%"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        borderRadius: '16px 16px 0 0'
                                    }}
                                />
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => handleMenuClick(event, compartilhar)}
                                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {`OS #${compartilhar.ordem}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`Compartilhado por: ${compartilhar.usuario_origem_nome}`}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleNavigate(compartilhar.ordem)}>Ver Detalhes</Button>
                            </CardActions>
                        </MuiCard>
                    </Grid>
                ))
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '26ch',
                    },
                }}
            >
                {selectedCompartilhar && selectedCompartilhar.usuario_origem === autenticaStore.usuario.id && (
                    <MenuItem onClick={handlePermissions}>Permissões</MenuItem>
                )}
                <MenuItem onClick={handleRemoveShare}>Remover Compartilhamento</MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{selectedCompartilhar ? `Detalhes da OS #${selectedCompartilhar.ordem}` : 'Detalhes do Compartilhamento'}</DialogTitle>
                <DialogContent>
                    {selectedCompartilhar ? (
                        <>
                            <Typography variant="h6">{`OS #${selectedCompartilhar.ordem}`}</Typography>
                            <Typography variant="body2" color="text.secondary">{`Compartilhado por: ${selectedCompartilhar.usuario_origem_nome}`}</Typography>
                        </>
                    ) : (
                        <Skeleton variant="text" />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Fechar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={permissionsDialogOpen} onClose={() => setPermissionsDialogOpen(false)}>
                <DialogTitle>Permissões de Compartilhamento</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.leitura}
                                onChange={handlePermissionsChange}
                                name="leitura"
                            />
                        }
                        label="Leitura"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.comentarios}
                                onChange={handlePermissionsChange}
                                name="comentarios"
                            />
                        }
                        label="Comentários"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.editor}
                                onChange={handlePermissionsChange}
                                name="editor"
                            />
                        }
                        label="Editor"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePermissionsDialogClose} color="primary">
                        Salvar
                    </Button>
                    <Button onClick={() => setPermissionsDialogOpen(false)} color="secondary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default CardCompartilhamento;
