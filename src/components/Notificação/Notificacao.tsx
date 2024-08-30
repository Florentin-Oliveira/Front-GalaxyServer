import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, IconButton, Badge, ListItemText, Button, Box, Typography } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import http from '../../http/index';
import autenticaStore from '../../store/autentica.store';
import { useNavigate } from 'react-router-dom';

interface Notificacao {
    id: number;
    tipo: string;
    detalhes: string;
    lida: boolean;
}

const Notificacao: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const token = autenticaStore.usuario.token;
                const response = await http.get<Notificacao[]>('/notificacoes/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const lidas = JSON.parse(localStorage.getItem('notificacoesLidas') || '{}');

                const notificacoesComEstado = response.data.map(notificacao => ({
                    ...notificacao,
                    lida: lidas[notificacao.id] || notificacao.lida
                }));

                setNotificacoes(notificacoesComEstado);
                console.log('Notificações carregadas:', notificacoesComEstado);
            } catch (error) {
                console.error('Erro ao buscar notificações', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificacoes();
    }, []);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClearNotifications = async () => {
        try {
            const token = autenticaStore.usuario.token;
            await http.delete('/notificacoes/Limpar/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Marca todas as notificações como lidas e remove-as da lista
            const notificacoesAtualizadas = notificacoes.map(notificacao => ({ ...notificacao, lida: true }));
            setNotificacoes([]); // Limpa a lista de notificações

            // Atualiza o localStorage para refletir as notificações como lidas
            const lidas = notificacoesAtualizadas.reduce((acc, notificacao) => {
                acc[notificacao.id] = true;
                return acc;
            }, {} as Record<number, boolean>);

            localStorage.setItem('notificacoesLidas', JSON.stringify(lidas));
            console.log('Notificações limpas:', lidas);  // Log quando notificações são limpas

            handleCloseMenu();
        } catch (error) {
            console.error('Erro ao limpar notificações', error);
        }
    };

    const handleLido = async (id: number, tipo: string) => {
        try {
            const token = autenticaStore.usuario.token;
            await http.patch(`/notificacoes/${id}/Lido/`, { tipo }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const notificacoesAtualizadas = notificacoes.map(notificacao =>
                notificacao.id === id ? { ...notificacao, lida: true } : notificacao
            );
            setNotificacoes(notificacoesAtualizadas);

            // Armazena o estado lido no localStorage
            const lidas = JSON.parse(localStorage.getItem('notificacoesLidas') || '{}');
            lidas[id] = true;
            localStorage.setItem('notificacoesLidas', JSON.stringify(lidas));
            console.log(`Notificação ${id} marcada como lida.`);
        } catch (error) {
            console.error('Erro ao marcar notificação como lida', error);
        }
    };

    const handleNavigateOS = (id: number) => {
        navigate(`/ViewOS/${id}`);
        handleCloseMenu();
    };

    const handleNavigateCliente = (id: number) => {
        navigate(`/ViewCliente/${id}`);
        handleCloseMenu();
    };

    const unreadCount = notificacoes.filter(notificacao => !notificacao.lida).length;

    return (
        <>
            <IconButton color="inherit" onClick={handleOpenMenu}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        width: 350,
                    },
                }}
            >
                {loading ? (
                    <MenuItem>Carregando notificações...</MenuItem>
                ) : notificacoes.length === 0 ? (
                    <MenuItem>Você não tem novas notificações.</MenuItem>
                ) : (
                    notificacoes.map((notificacao) => (
                        <MenuItem key={notificacao.id}>
                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                <ListItemText 
                                    primary={notificacao.tipo} 
                                    secondary={notificacao.detalhes} 
                                    style={{ 
                                        color: notificacao.lida ? '#b0b0b0' : 'inherit'
                                    }}
                                />
                                {notificacao.lida && (
                                    <Typography 
                                        variant="caption" 
                                        color="#b0b0b0" 
                                        sx={{ textAlign: 'right' }} // Alinha "Lida" à direita
                                    >
                                        Lida
                                    </Typography>
                                )}
                            </Box>
                            <Box display="flex" flexDirection="column">
                                {notificacao.tipo === 'Ordem de Serviço' && (
                                    <Button onClick={() => handleNavigateOS(notificacao.id)}>Ver</Button>
                                )}
                                {notificacao.tipo === 'Cliente' && (
                                    <Button onClick={() => handleNavigateCliente(notificacao.id)}>Ver</Button>
                                )}
                                {!notificacao.lida && (
                                    <Button onClick={() => handleLido(notificacao.id, notificacao.tipo)}>
                                        Marcar como lida
                                    </Button>
                                )}
                            </Box>
                        </MenuItem>
                    ))
                )}
                <MenuItem onClick={handleClearNotifications}>
                    <ListItemText primary="Limpar notificações" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default Notificacao;
