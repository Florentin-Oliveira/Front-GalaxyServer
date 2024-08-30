import React from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import http from '../../http';

interface RelatorioPDFButtonProps {
    ordemId: number;
}

const RelatorioPDFButton: React.FC<RelatorioPDFButtonProps> = ({ ordemId }) => {
    const handleDownload = async () => {
        try {
            const response = await http.get(`/relatorio-pdf/${ordemId}/`, { 
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' }); 
            saveAs(blob, `relatorio_ordem_${ordemId}.pdf`); 
        } catch (error) {
            console.error('Erro ao gerar relatório PDF:', error);
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload} sx={{ borderRadius: '20px' }}>
            Gerar Comprovante
        </Button>
    );
};

export default RelatorioPDFButton;
