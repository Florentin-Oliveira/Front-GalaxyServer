import { useState } from 'react';
import http from '../http';
import Cookies from 'js-cookie';
import { IResponseData } from '../Interface/IRespostaData';
import autenticaStore from '../store/autentica.store';

export default function usePost() {
    const [erro, setErro] = useState<string>('');
    const [sucesso, setSucesso] = useState<boolean>(false);
    const [resposta, setResposta] = useState<IResponseData | null>(null);

    async function cadastrarDados<T>({ url, dados, authToken }: { url: string; dados: T; authToken?: string }) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        };

        const csrfToken = Cookies.get('csrftoken');
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }

        try {
            const response = await http.post(url, dados, { headers, withCredentials: true });
            setSucesso(true);
            setResposta(response.data);
            setErro(''); // Limpa o erro ao obter sucesso
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                autenticaStore.handle401();
            } else {
                const errorMessage = error.response?.data?.detail || 'Ocorreu um erro desconhecido ao processar sua requisição.';
                setErro(errorMessage);
                setSucesso(false);
                setResposta(null);
            }
        }
    }

    return { cadastrarDados, sucesso, erro, resposta };
}
