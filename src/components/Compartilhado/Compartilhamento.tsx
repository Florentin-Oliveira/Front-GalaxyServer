import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import http from '../../http';
import autenticaStore from '../../store/autentica.store';

interface CompartilhamentoProps {
    ordemId: number;
    open: boolean;
    onClose: () => void;
    compartilhamentoId?: number; 
}

const Compartilhamento: React.FC<CompartilhamentoProps> = ({ ordemId, open, onClose, compartilhamentoId }) => {
    const [shareUser, setShareUser] = useState<string>('');
    const [userId, setUserId] = useState<number | null>(null);
    const [permissao, setPermissao] = useState<string>('leitura');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const currentUser = autenticaStore.usuario;

    useEffect(() => {
        const fetchUserId = async () => {
            if (shareUser) {
                try {
                    const response = await http.get(`/users/?search=${shareUser}`);
                    const results = response.data.results;

                    if (results && results.length > 0) {
                        const foundUser = results[0];
                        setUserId(foundUser.id);
                    } else {
                        setUserId(null);
                        setErrorMessage('Usuário não encontrado.');
                    }
                } catch (error) {
                    setErrorMessage('Erro ao buscar ID do usuário.');
                }
            }
        };

        fetchUserId();
    }, [shareUser]);

    const handleShare = async () => {
        if (!userId) {
            setErrorMessage('ID do usuário não encontrado.');
            return;
        }

        if (userId === currentUser.id) {
            setErrorMessage('Não é possível compartilhar com você mesmo.');
            return;
        }

        try {
            const requestData = {
                usuario_origem: currentUser.id,
                usuario_destino: userId,
                ordem: ordemId,
                permissao: permissao,
            };

            const response = await http.post('/compartilhamento/', requestData);
            if (response.status === 201) {
                const permissaoDescricao = {
                    leitura: "Somente Leitura",
                    comentario: "Somente Comentário",
                    editor: "Editor",
                }[permissao];

                setSuccessMessage(`Compartilhamento realizado com sucesso com permissão: ${permissaoDescricao}`);
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                throw new Error('Falha ao compartilhar'); 
            }

        } catch (error: any) {
            if (error.response && error.response.data && typeof error.response.data.detail === 'string') {
                setErrorMessage(error.response.data.detail);
            } else if (error.response && error.response.status === 400 && error.response.data.non_field_errors) {
                const validationError = error.response.data.non_field_errors[0];
                if (validationError === 'Esta ordem já foi compartilhada com este usuário.') {
                    setErrorMessage(validationError);
                } else {
                    setErrorMessage('Erro ao compartilhar a ordem.');
                }
            } else {
                setErrorMessage('Erro ao compartilhar. Você não tem permissão para compartilhar esta ordem, pois não é o dono.');
            }
        }
    };
    const handleRemoveShare = async () => {
        if (!compartilhamentoId) {
            setErrorMessage('ID do compartilhamento não encontrado.');
            return;
        }

        try {
            const response = await http.delete(`/compartilhamento/${compartilhamentoId}/`);
            if (response.status === 204) {  
                setSuccessMessage('Compartilhamento removido com sucesso');
                setTimeout(() => {
                    onClose(); 
                }, 1000); 
            }
        } catch (error) {
            setErrorMessage('Erro ao remover compartilhamento.');
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Compartilhar Ordem</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Insira o email ou username do usuário com quem deseja compartilhar.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email ou Username"
                        type="text"
                        fullWidth
                        value={shareUser}
                        onChange={(e) => {
                            setShareUser(e.target.value);
                            setUserId(null); 
                        }}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="select-permissao-label">Permissão</InputLabel>
                        <Select
                            labelId="select-permissao-label"
                            value={permissao}
                            onChange={(e) => setPermissao(e.target.value as string)}
                            label="Permissão"
                        >
                            <MenuItem value="leitura">Somente Leitura</MenuItem>
                            <MenuItem value="comentario">Somente Comentário</MenuItem>
                            <MenuItem value="editor">Editor</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleShare} color="primary" disabled={!shareUser || !userId}>
                        Compartilhar
                    </Button>
                    {compartilhamentoId && (
                        <Button onClick={handleRemoveShare} color="secondary">
                            Remover Compartilhamento
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessMessage(null)} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setErrorMessage(null)} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Compartilhamento;
