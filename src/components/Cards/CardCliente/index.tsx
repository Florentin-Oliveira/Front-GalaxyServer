import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Card as MuiCard, CardContent, Typography, CardActions, Button, Hidden, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import { ICliente } from '../../../Interface/ICliente';
import autenticaStore from '../../../store/autentica.store';
import FavoritoCliente from '../../Favoritos/FavoritoCliente';
import GatoOculos from '../../../assets/image/GatoOculos.png';
import Flor from '../../../assets/image/Flor.png';
import Fantasma from '../../../assets/image/Fantasma.png';
import Dinossauro from '../../../assets/image/Dinossauro.png';

const images = [GatoOculos, Flor, Fantasma, Dinossauro];

const CardCliente: React.FC = () => {
    const [clienteList, setClienteList] = useState<ICliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshFavoritos, setRefreshFavoritos] = useState<boolean>(false);
    const navigate = useNavigate();
    const theme = useTheme();  // Obtém o tema atual

    useEffect(() => {
        async function fetchClienteList() {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('/clientes', { headers });
                setClienteList(response.data.results);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchClienteList();
    }, [refreshFavoritos]);

    const handleFavoritoChange = () => {
        setRefreshFavoritos(!refreshFavoritos);
    };

    const handleNavigate = (id: number) => {
        navigate(`/ViewCliente/${id}`);
    };

    const handleNavigate2 = () => {
        navigate('/FormCliente');
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
            {clienteList.length === 0 ? (
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', marginTop: 2  }}>
                    Nenhum cliente encontrado!
                </Typography>
            ) : (
                clienteList.map((cliente, index) => (
                    <Grid item key={cliente.id} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
                                backgroundColor: theme.palette.background.paper, // Defina o fundo do cartão
                                color: theme.palette.text.primary // Defina a cor do texto de acordo com o tema
                                
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
                            <CardContent sx={{ flexGrow: 0, paddingBottom: 0, height: 'auto' }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem', color: theme.palette.text.primary }}>
                                    {`Cliente: ${cliente.nome}`}
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {cliente.email}
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {cliente.telefone}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', padding: '1px 1px', flexShrink: 0 }}>
                                <Button size="small" sx={{ margin: '0 5px', padding: '4px', color: theme.palette.primary.main }} onClick={() => handleNavigate(cliente.id)}>Ver</Button>
                                <Button size="small" sx={{ margin: '0 5px', padding: '4px', color: theme.palette.primary.main }} onClick={handleNavigate2}>Novo</Button>
                                <Hidden mdUp>
                                    <FavoritoCliente clienteId={cliente.id} onFavoritoChange={handleFavoritoChange} />
                                </Hidden>
                                <Hidden mdDown>
                                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '0 5px' }}>
                                        <FavoritoCliente clienteId={cliente.id} onFavoritoChange={handleFavoritoChange} />
                                    </Box>
                                </Hidden>
                            </CardActions>
                        </MuiCard>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default CardCliente;
