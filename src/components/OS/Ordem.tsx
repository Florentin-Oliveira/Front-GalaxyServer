import React, { useEffect, useState } from 'react';
import OSItem from './Item/OrdemServicoItem'; 
import { IOS } from '../../Interface/IOS'; 
import http from '../../http'; 

const Ordem: React.FC = () => {
  const [ordens, setOrdens] = useState<IOS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdens = async () => { 
      try {
        const response = await http.get<IOS[]>('/ordens');
        setOrdens(response.data);
      } catch (err) {
        setError('Erro ao buscar as Ordens'); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Ordens de Serviços</h1>
      {ordens.map((ordem) => ( 
        <OSItem key={ordem.id} ordem={ordem} />
      ))}
    </div>
  );
};

export default Ordem;