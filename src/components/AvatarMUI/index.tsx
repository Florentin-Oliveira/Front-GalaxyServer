import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip'; 
import http from '../../http';

interface TotalAvatarsProps {
    ordemId: number;
}

const TotalAvatars: React.FC<TotalAvatarsProps> = ({ ordemId }) => {
    const [users, setUsers] = useState<{ id: number, username: string }[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log(`Buscando usuários para a ordem de serviço com ID: ${ordemId}`);
                const response = await http.get(`/compartilhamento/${ordemId}/usuarios/`);
                console.log('Resposta da API:', response.data);
                if (response.data && response.data.length > 0) {
                    setUsers(response.data);
                    console.log('Usuários definidos no estado:', response.data);
                } else {
                    console.log('Nenhum usuário encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar usuários compartilhados:', error);
            }
        };

        fetchUsers();
    }, [ordemId]);

    return (
        <AvatarGroup max={4}>
            {users.map((user) => (
                <Tooltip title={user.username} key={user.id}>
                    <Avatar>
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                </Tooltip>
            ))}
        </AvatarGroup>
    );
};

export default TotalAvatars;
