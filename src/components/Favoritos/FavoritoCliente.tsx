import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import http from '../../http';
import autenticaStore from '../../store/autentica.store';

interface FavoritoClienteProps {
    clienteId: number;
    onFavoritoChange: () => void;
    isFavorito?: boolean;
    onDesfavoritar?: (clienteId: number) => void;
}

const FavoritoCliente: React.FC<FavoritoClienteProps> = ({ clienteId, onFavoritoChange, isFavorito = false, onDesfavoritar }) => {
    const [isFavorited, setIsFavorited] = useState<boolean>(isFavorito);
    const [favoritoId, setFavoritoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchFavoritoStatus = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('favoritas/clientes/', { headers });
                const favoritos = Array.isArray(response.data.results) ? response.data.results : [];
                const favorito = favoritos.find((fav: any) => fav.cliente === clienteId);
                if (favorito) {
                    setIsFavorited(true);
                    setFavoritoId(favorito.id);
                } else {
                    setIsFavorited(false);
                    setFavoritoId(null);
                }
            } catch (error) {
                console.error('Erro ao buscar status de favorito:', error);
            }
        };
        fetchFavoritoStatus();
    }, [clienteId, isFavorito]);

    const toggleFavorito = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${autenticaStore.usuario.token}`
            };
            if (isFavorited && favoritoId !== null) {
                if (onDesfavoritar) {
                    await onDesfavoritar(clienteId);
                } else {
                    await http.delete(`favoritas/clientes/${favoritoId}/`, { headers });
                }
                setIsFavorited(false);
                setFavoritoId(null);
            } else {
                const response = await http.post('favoritas/clientes/', { cliente: clienteId }, { headers });
                setIsFavorited(true);
                setFavoritoId(response.data.id);
            }
            onFavoritoChange();
        } catch (error) {
            console.error('Erro ao alterar favorito:', error);
        }
    };

    return (
        <IconButton onClick={toggleFavorito}>
            {isFavorited ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
    );
};

export default FavoritoCliente;
