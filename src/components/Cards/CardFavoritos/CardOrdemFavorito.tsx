import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Card as MuiCard, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import autenticaStore from '../../../store/autentica.store';
import FavoritoOrdem from '../../Favoritos/FavoritoOrdem';
import { IOS } from '../../../Interface/IOS';
import Univerce from '../../../assets/image/Univerce.png';
import Space from '../../../assets/image/Space.png';
import Fantasma from '../../../assets/image/Fantasma.png';
import Dinossauro from '../../../assets/image/Dinossauro.png';

const images = [Univerce, Space, Fantasma, Dinossauro];

const CardOrdemFavoritos: React.FC = () => {
    const [favoritosList, setFavoritosList] = useState<IOS[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshFavoritos, setRefreshFavoritos] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFavoritosList() {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('/favoritas/ordens/', { headers });
                const favoritos = response.data.results;
                const favoritosIds = favoritos.map((fav: any) => fav.ordem);

                if (favoritosIds.length > 0) {
                    const ordemResponse = await http.get('/ordens/', { headers });
                    const ordens = ordemResponse.data.results;
                    const ordensFavoritas = ordens.filter((ordem: IOS) => favoritosIds.includes(ordem.id));
                    setFavoritosList(ordensFavoritas);
                } else {
                    setFavoritosList([]);
                }
            } catch (error) {
                console.error('Erro ao buscar os favoritos:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchFavoritosList();
    }, [refreshFavoritos]);

    const handleFavoritoChange = () => {
        setRefreshFavoritos(!refreshFavoritos);
    };

    const handleNavigate = (id: number) => {
        navigate(`/ViewOS/${id}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {favoritosList.length === 0 ? (
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
                    Nenhum item favoritado.
                </Typography>
            ) : (
                favoritosList.map((favorito, index) => (
                    <Grid item key={favorito.id} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
                                    height: { xs: 0, sm: 125 },
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
                            <CardContent sx={{ padding: '8px' }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                                    {`OS: ${favorito.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`Status: ${favorito.status}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`Prioridade: ${favorito.prioridade}`}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handleNavigate(favorito.id)}>Ver</Button>
                                <FavoritoOrdem ordemId={favorito.id} onFavoritoChange={handleFavoritoChange} isFavorito={true} />
                            </CardActions>
                        </MuiCard>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default CardOrdemFavoritos;
