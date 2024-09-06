import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, Paper, Dialog, ClickAwayListener, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, useMediaQuery, useTheme, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Help as HelpIcon } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import autenticaStore from '../../store/autentica.store';
import http from '../../http/index';
import SwitchButon from '../../themes/SwitchButon';
import Pesquisa from '../Pesquisa/Pesquisa';
import Notificacao from '../Notificação/Notificacao';
import MiLogoPng from '../../assets/image/MiLogoPng.png';

const pages = [
    { name: 'Início', route: '/' },
    { name: 'Criar OS', route: '/FormOS'},
    { name: 'Novo Cliente', route: '/FormCliente'},
    { name: 'Meus Clientes', route: '/Clientes' },
    { name: 'Favoritos', route: '/Favoritos' },
    { name: 'Compartilhados', route: '/CompatilhadosComigo' }
];

const settings = ['Perfil', 'Sair'];

interface SearchResults {
    clientes: Array<{ id: number, nome: string, email: string }>;
    ordens: Array<{ id: number, descricao: string }>;
}

function NavBar() {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [logoutSuccess, setLogoutSuccess] = useState(false);
    const [openHelpDialog, setOpenHelpDialog] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [clearSearch, setClearSearch] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            setLogoutSuccess(false);
        }, 2000);
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (route: string) => {
        setAnchorElNav(null);
        navigate(route);
    };

    const handleCloseUserMenu = (setting: string) => {
        setAnchorElUser(null);
        if (setting === 'Perfil') {
            navigate('/UserPerfil');
        } else if (setting === 'Sair') {
            setOpenLogoutDialog(true);
        }
    };

    const handleLogout = async () => {
        try {
            const token = autenticaStore.usuario.token;
            await http.post('logout/', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            autenticaStore.logout();
            setLogoutSuccess(true);
            setOpenLogoutDialog(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleCloseSnackbar = () => {
        setLogoutSuccess(false);
    };

    const handleSearch = (results: SearchResults) => {
        console.log('Realizando pesquisa com os resultados:', results);
        setSearchResults(results);
        setClearSearch(false);
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setClearSearch(true);
    };

    const handleNavigateOS = (id: number) => {
        setSearchResults(null);
        navigate(`/ViewOS/${id}`);
    };

    const handleNavigateCliente = (id: number) => {
        setSearchResults(null);
        navigate(`/ViewCliente/${id}`);
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    margin: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#2C2C34',
                    color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
                    boxShadow: theme.palette.mode === 'light' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                }}
            >
                <Toolbar disableGutters sx={{ overflowX: 'hidden', flexWrap: 'nowrap', padding: 0, margin: 0, width: '100%' }}>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{ marginRight: -0.20 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => handleCloseNavMenu('')}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleCloseNavMenu(page.route)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Tooltip title="GalaxyServer-ManagerOS">
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', left: 0 }}>
                            <img src={MiLogoPng} alt="Logo" style={{ height: 70, width: 70 }} />
                        </Box>
                    </Tooltip>

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            ml: 0,
                            mr: 0,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            position: 'relative',
                            left: 0
                        }}
                    >
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, overflowX: 'hidden', justifyContent: 'flex-start', ml: 0 }}>
                        {pages.map((page) => (
                            <Tooltip key={page.name} title={page.name}>
                                <Button
                                    onClick={() => handleCloseNavMenu(page.route)}
                                    sx={{
                                        my: 2,
                                        color: location.pathname === page.route ? 'darkviolet' : theme.palette.text.primary,
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.85rem',
                                        mx: 0.1,
                                        position: 'relative',
                                        transition: 'color 0.3s, transform 0.3s',
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: 'violet',
                                            bottom: 0,
                                            left: 0,
                                            transform: location.pathname === page.route ? 'scaleX(1)' : 'scaleX(0)',
                                            transformOrigin: 'left',
                                            transition: 'transform 0.3s ease-in-out',
                                        },
                                        '&:hover:after': {
                                            transform: 'scaleX(1)',
                                        },
                                        '&:hover': {
                                            color: 'darkviolet',
                                        },
                                    }}
                                >
                                    {page.name}
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>
                    {isDesktop && (
                        <Tooltip title="Crie Novas Ordens de Serviços">
                            <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => navigate('/FormOS')}>
                                Criar
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title="Modos">
                        <Box sx={{ display: 'inline-block' }}>
                            <SwitchButon />
                        </Box>
                    </Tooltip>
                    <Box
                        sx={{
                            boxShadow: theme.palette.mode === 'light' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                        }}
                    >
                        <Pesquisa
                            onSearch={handleSearch}
                            clearSearch={clearSearch}
                        />
                    </Box>
                    <Tooltip title="Notificacoes">
                        <Box sx={{ display: 'inline-block' }}>
                            <Notificacao />
                        </Box>
                    </Tooltip>
                    <Tooltip title="Alguma dúvida?">
                        <IconButton size="large" aria-label="help" color="inherit" onClick={() => setOpenHelpDialog(true)}>
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>


                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Perfil do Usuario">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{
                                    p: 0,
                                    width: 50,
                                    height: 50,
                                    marginLeft: 0.5, 
                                    mr: '50px' 
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        boxShadow: theme.palette.mode === 'light' ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                                        backgroundColor: theme.palette.mode === 'light' ? grey[100] : grey[100],
                                        color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
                                    }}
                                >
                                    {autenticaStore.usuario.username[0].toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={() => setAnchorElUser(null)}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>

            </AppBar>
            {searchResults !== null ? (
                <ClickAwayListener onClickAway={handleClearSearch}>
                    <Box
                        sx={{
                            padding: 2,
                            position: 'absolute',
                            top: '64px',
                            left: 'calc(100% - 520px)',
                            width: '80%',
                            maxWidth: '500px',
                            backgroundColor: theme.palette.background.paper,
                            zIndex: 1,
                            boxShadow: 3,
                            borderRadius: 1
                        }}
                    >
                        <Typography variant="h6">Resultados da Pesquisa:</Typography>
                        {searchResults.clientes.length === 0 && searchResults.ordens.length === 0 ? (
                            <Typography>Nenhum resultado encontrado</Typography>
                        ) : (
                            <Box>
                                {searchResults.clientes.length > 0 && (
                                    <>
                                        <Typography variant="h6">Clientes:</Typography>
                                        <List>
                                            {searchResults.clientes.map((cliente: any) => (
                                                <ListItem key={cliente.id}>
                                                    <ListItemText primary={cliente.nome} secondary={cliente.email} />
                                                    <Button size="small" onClick={() => handleNavigateCliente(cliente.id)}>Ver</Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                                {searchResults.ordens.length > 0 && (
                                    <>
                                        <Typography variant="h6">Ordens de Serviço:</Typography>
                                        <List>
                                            {searchResults.ordens.map((ordem: any) => (
                                                <ListItem key={ordem.id}>
                                                    <ListItemText primary={`OS: ${ordem.id}`} secondary={ordem.descricao} />
                                                    <Button size="small" onClick={() => handleNavigateOS(ordem.id)}>Ver</Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>
                </ClickAwayListener>
            ) : null}


<Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
    <DialogTitle 
        id="alert-dialog-title"
        sx={{
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
        }}
    >
        {"Confirmação de Logout"}
    </DialogTitle>
    <DialogContent>
        <DialogContentText 
            id="alert-dialog-description"
            sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
            }}
        >
            Tem certeza de que deseja sair?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button 
            onClick={() => setOpenLogoutDialog(false)}
            sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
            }}
        >
            Cancelar
        </Button>
        <Button 
            onClick={handleLogout} 
            autoFocus
            sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
            }}
        >
            Sair
        </Button>
    </DialogActions>
</Dialog>

<Snackbar open={logoutSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
        Logout realizado com sucesso!
    </Alert>
</Snackbar>

<Dialog open={openHelpDialog} onClose={() => setOpenHelpDialog(false)}>
    <DialogTitle
        sx={{
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
        }}
    >
        Ajuda
    </DialogTitle>
    <DialogContent>
        <DialogContentText
            sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
            }}
        >
            Como podemos te ajudar hoje?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button 
            onClick={() => setOpenHelpDialog(false)}
            sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : 'inherit'
            }}
        >
            Fechar
        </Button>
    </DialogActions>
</Dialog>

        </>
    );
}

export default NavBar;
