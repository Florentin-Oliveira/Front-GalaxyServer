import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, useTheme } from '@mui/material';
import http from '../../http';
import { IComentario } from '../../Interface/IComentario';

interface ComentarioFormProps {
    ordemId: number;
    onSave: () => void; // Callback to trigger on save
}

const ComentarioForm: React.FC<ComentarioFormProps> = ({ ordemId, onSave }) => {
    const [texto, setTexto] = useState<string>('');
    const theme = useTheme();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            console.log(`Enviando comentário para a ordem ${ordemId} com texto: ${texto}`);
            const response = await http.post<IComentario>('/comentario/', {
                texto,
                ordem: ordemId,
            });
            console.log('Comentário criado com sucesso:', response.data);
            setTexto('');
            onSave(); // Trigger the callback to refresh the list and close the form
        } catch (error) {
            console.error('Erro ao criar o comentário:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <ReactQuill
                value={texto}
                onChange={setTexto}
                style={{
                    borderRadius: '8px', // Arredondamento
                    marginBottom: '16px',
                    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff', // Ajusta o fundo para modo escuro
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Ajusta a cor do texto para modo escuro
                }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    borderRadius: '20px', // Botão arredondado
                    width: '100%', // Botão ocupa toda a largura
                }}
            >
                Salvar Comentário
            </Button>
        </form>
    );
};

export default ComentarioForm;
