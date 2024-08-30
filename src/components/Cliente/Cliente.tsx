import React, { useEffect, useState } from 'react';
import ClienteItem from './Item/ClienteItem';
import { ICliente } from '../../Interface/ICliente';
import http from '../../http';

const Cliente: React.FC = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await http.get<ICliente[]>('/clientes');
        setClientes(response.data);
      } catch (err) {
        setError('Erro ao buscar os clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Clientes</h1>
      {clientes.map(cliente => (
        <ClienteItem key={cliente.id} cliente={cliente} />
      ))}
    </div>
  );
}

export default Cliente;
