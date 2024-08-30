import React, { useState, useEffect } from 'react';
import { Box, Tooltip, InputBase, styled, alpha, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import http from '../../http';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    left: 0,
    color: 'lightgray',
    zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    paddingLeft: theme.spacing(6),
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

interface PesquisaProps {
    onSearch: (results: any) => void;
    clearSearch: boolean;
}

const Pesquisa: React.FC<PesquisaProps> = ({ onSearch, clearSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (clearSearch) {
            setSearchQuery('');
        }
    }, [clearSearch]);

    const handleFocus = () => {
        console.log('Campo de pesquisa focado');
    };

    const handleBlur = () => {
        console.log('Campo de pesquisa desfocado');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        console.log('Valor do campo de pesquisa alterado:', event.target.value);
    };

    const handleSearchClick = async () => {
        console.log('Ícone de pesquisa clicado');
        if (!searchQuery.trim()) {
            onSearch({ clientes: [], ordens: [] });
            return;
        }
        try {
            const [clientesResponse, ordensResponse] = await Promise.all([
                http.get(`/clientes/`, { params: { search: searchQuery } }),
                http.get(`/ordens/`, { params: { search: searchQuery } })
            ]);
            console.log('Resultados da pesquisa clientes:', clientesResponse.data);
            console.log('Resultados da pesquisa ordens:', ordensResponse.data);
            onSearch({
                clientes: clientesResponse.data.results,
                ordens: ordensResponse.data.results
            });
        } catch (error) {
            console.error('Erro ao realizar a pesquisa:', error);
            onSearch({ clientes: [], ordens: [] });
        }
    };

    return (
        <Search>
            <Tooltip title="Pesquisar">
                <SearchIconWrapper onClick={handleSearchClick}>
                    <SearchIcon />
                </SearchIconWrapper>
            </Tooltip>
            <StyledInputBase
                placeholder="Pesquisar"
                value={searchQuery}
                inputProps={{ 'aria-label': 'search' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
            />
        </Search>
    );
};

export default Pesquisa;
