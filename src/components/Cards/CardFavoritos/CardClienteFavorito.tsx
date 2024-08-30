import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Card as MuiCard, CardContent, Typography, CardActions, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import autenticaStore from '../../../store/autentica.store';
import FavoritoCliente from '../../Favoritos/FavoritoCliente';
import { ICliente } from '../../../Interface/ICliente';
import Neblina from '../../../assets/image/Neblina.png';
import ViaLactea from '../../../assets/image/ViaLactea.png';
import GatoOculos from '../../../assets/image/GatoOculos.png';
import Flor from '../../../assets/image/Flor.png';

const images = [Neblina, ViaLactea, GatoOculos, Flor];

const CardClienteFavoritos: React.FC = () => {
    const [favoritosList, setFavoritosList] = useState<ICliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshFavoritos, setRefreshFavoritos] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchFavoritosList() {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('/favoritas/clientes/', { headers });
                const favoritos = response.data.results;
                const favoritosIds = favoritos.map((fav: any) => fav.cliente);
                
                if (favoritosIds.length > 0) {
                    const clienteResponse = await http.get('/clientes/', { headers });
                    const clientes = clienteResponse.data.results;
                    const clientesFavoritos = clientes.filter((cliente: ICliente) => favoritosIds.includes(cliente.id));
                    setFavoritosList(clientesFavoritos);
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
        navigate(`/ViewCliente/${id}`);
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
                                    height: { xs: 100, sm: 125 }, // Ajuste a altura da imagem para diferentes tamanhos de tela
                                    flexShrink: 0 // Garante que a imagem não encolha
                                }}
                            >
                                <img
                                    src={images[index % images.length]}
                                    alt="Space"
                                    width="100%" // Ajuste a largura para 100% para garantir que a imagem se ajuste ao container
                                    height="100%" // Ajuste a altura para garantir que a imagem se ajuste ao container
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        borderRadius: '16px 16px 0 0'
                                    }}
                                />
                            </Box>
                            <CardContent sx={{ padding: '8px' }}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {`Cliente: ${favorito.nome}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`id: ${favorito.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`E-mail: ${favorito.email}`}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleNavigate(favorito.id)}>Ver Detalhes</Button>
                                <FavoritoCliente clienteId={favorito.id} onFavoritoChange={handleFavoritoChange} isFavorito={true} />
                            </CardActions>
                        </MuiCard>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default CardClienteFavoritos;
