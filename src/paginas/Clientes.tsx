import React from 'react';
import CardCliente from '../components/Cards/CardCliente';
import { Box, Typography } from '@mui/material';

export default function AreaTrabalho() {
    return (
        <>
            <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        transform: { xs: 'none', md: 'translateX(-30%)' },
                    }}
                >
                    Meus Clientes!
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
                    margin: '20px auto',
                    transform: { xs: 'none', md: 'translateX(-30%)' },
                }}
            >
                <CardCliente />
            </Box>
        </>
    );
}
