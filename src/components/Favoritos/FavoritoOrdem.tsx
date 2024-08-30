import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import http from '../../http';
import autenticaStore from '../../store/autentica.store';

interface FavoritoOrdemProps {
    ordemId: number;
    onFavoritoChange: () => void;
    isFavorito?: boolean;
    onDesfavoritar?: (ordemId: number) => void;
}

const FavoritoOrdem: React.FC<FavoritoOrdemProps> = ({ ordemId, onFavoritoChange, isFavorito = false, onDesfavoritar }) => {
    const [isFavorited, setIsFavorited] = useState<boolean>(isFavorito);
    const [favoritoId, setFavoritoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchFavoritoStatus = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${autenticaStore.usuario.token}`
                };
                const response = await http.get('favoritas/ordens/', { headers });
                const favoritos = Array.isArray(response.data.results) ? response.data.results : [];
                const favorito = favoritos.find((fav: any) => fav.ordem === ordemId);
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
    }, [ordemId, isFavorito]);

    const toggleFavorito = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${autenticaStore.usuario.token}`
            };
            if (isFavorited && favoritoId !== null) {
                if (onDesfavoritar) {
                    await onDesfavoritar(ordemId);
                } else {
                    await http.delete(`favoritas/ordens/${favoritoId}/`, { headers });
                }
                setIsFavorited(false);
                setFavoritoId(null);
            } else {
                const response = await http.post('favoritas/ordens/', { ordem: ordemId }, { headers });
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

export default FavoritoOrdem;
