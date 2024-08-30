import React, { useState } from 'react';
import { IAnexo } from '../../Interface/IAnexo';
import http from '../../http';
import { Box, Button, Typography } from '@mui/material';

interface AnexoFormProps {
    ordemId: number;
    onSave: (anexo: IAnexo) => void;
}

const AnexoForm: React.FC<AnexoFormProps> = ({ ordemId, onSave }) => {
    const [arquivo, setArquivo] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('ordem', ordemId.toString());
        if (arquivo) {
            formData.append('arquivo', arquivo);
        }
        try {
            console.log(`Enviando anexo para a ordem ${ordemId}`);
            const response = await http.post<IAnexo>('/anexo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Anexo criado com sucesso:', response.data);
            onSave(response.data);
        } catch (error) {
            console.error('Erro ao criar o anexo:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <input
                accept="*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={(e) =>
                    setArquivo(
                        (e.target as HTMLInputElement).files
                            ? (e.target as HTMLInputElement).files![0]
                            : null
                    )
                }
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                    Escolher arquivo
                </Button>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {arquivo ? arquivo.name : "Nenhum arquivo escolhido"}
                </Typography>
            </label>
        </Box>
    );
};

export default AnexoForm;
