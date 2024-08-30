import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Card as MuiCard, CardContent, Typography, CardActions, Button, Hidden, IconButton } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import { IOS } from '../../../Interface/IOS';
import FavoritoOrdem from '../../Favoritos/FavoritoOrdem';
import autenticaStore from '../../../store/autentica.store';
import Compartilhamento from '../../Compartilhado/Compartilhamento';
import ViaLactea from '../../../assets/image/ViaLactea.png';
import Univerce from '../../../assets/image/Univerce.png';
import Space from '../../../assets/image/Space.png';
import Neblina from '../../../assets/image/Neblina.png';

const images = [ViaLactea, Univerce, Space, Neblina];

interface CardProps {
    clienteId?: number; // Prop opcional para filtrar por clienteId
}

const Card: React.FC<CardProps> = ({ clienteId }) => {
    const [osList, setOsList] = useState<IOS[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshFavoritos, setRefreshFavoritos] = useState<boolean>(false);
    const [ordemIdToShare, setOrdemIdToShare] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOSList() {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('/ordens', { headers });
    
                let ordens = response.data.results as IOS[];

                // Se clienteId foi passado, filtre as ordens por clienteId
                if (clienteId) {
                    ordens = ordens.filter(os => os.cliente === clienteId);
                } else {
                    // Se não, filtre as ordens criadas pelo usuário autenticado
                    ordens = ordens.filter(os => os.user === autenticaStore.usuario.id);
                }
    
                setOsList(ordens);
            } catch (error) {
                console.error('Erro ao buscar ordens de serviço:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOSList();
    }, [refreshFavoritos, clienteId]);

    const handleFavoritoChange = () => {
        setRefreshFavoritos(!refreshFavoritos);
    };

    const handleNavigate = (id: number) => {
        navigate(`/ViewOS/${id}`);
    };

    const handleNavigate1 = () => {
        navigate('/FormOS');
    };

    const handleOpenDialog = (id: number) => {
        setOrdemIdToShare(id);
    };

    const handleCloseDialog = () => {
        setOrdemIdToShare(null);
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
            {osList.length === 0 ? (
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
                    Nenhuma ordem encontrada!
                </Typography>
            ) : (
                osList.map((os, index) => (
                    <Grid item key={os.id} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <MuiCard 
                            sx={{ 
                                maxWidth: { xs: 250, sm: 250 },
                                position: 'relative', 
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    height: { xs: 100, sm: 125 },
                                    flexShrink: 0
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
                            </Box>
                            <CardContent sx={{ flexGrow: 0, paddingBottom: 0, height: 'auto' }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                                    {`OS: ${os.id}`}
                                    <Hidden mdUp>
                                        <FavoritoOrdem ordemId={os.id} onFavoritoChange={handleFavoritoChange} />
                                    </Hidden>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {os.status}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {os.prioridade}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', padding: '1px 1px', flexShrink: 0 }}>
                                <Button onClick={() => handleNavigate(os.id)}>Ver</Button>
                                <Button onClick={handleNavigate1}>Novo</Button>
                                <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 5px' }}>
                                    <IconButton size="small" sx={{ margin: '0 5px', padding: '4px' }} onClick={() => handleOpenDialog(os.id)}>
                                        <ShareIcon />
                                    </IconButton>
                                    <Hidden mdDown>
                                        <Box sx={{ margin: '0 5px', padding: '4px' }}>
                                            <FavoritoOrdem ordemId={os.id} onFavoritoChange={handleFavoritoChange} />
                                        </Box>
                                    </Hidden>
                                </Box>
                            </CardActions>
                        </MuiCard>
                    </Grid>
                ))
            )}
            {ordemIdToShare && (
                <Compartilhamento ordemId={ordemIdToShare} open={Boolean(ordemIdToShare)} onClose={handleCloseDialog} />
            )}
        </Grid>
    );
};

export default Card;
