import React from 'react';
import CardClienteFavoritos from '../components/Cards/CardFavoritos/CardClienteFavorito';
import CardOrdemFavoritos from '../components/Cards/CardFavoritos/CardOrdemFavorito';
import { Box, Typography } from '@mui/material';

export default function FavoritoPaginaIndividual() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                transform: { xs: 'none', md: 'translateX(-10%)' },
            }}
        >
            <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }}
                >
                   Meus favoritos
                </Typography>
            </Box>

            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: 4,
                    borderRadius: 5,
                    boxShadow: 5,
                    marginTop: 2,
                    maxWidth: '600px',
                    width: '100%',
                    margin: '20px auto'
                }}
            >
                <CardClienteFavoritos />
            </Box>

            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: 4,
                    borderRadius: 5,
                    boxShadow: 5,
                    marginTop: 2,
                    maxWidth: '600px',
                    width: '100%',
                    margin: '20px auto'
                }}
            >               
                <CardOrdemFavoritos />
            </Box>
        </Box>
    );
}
