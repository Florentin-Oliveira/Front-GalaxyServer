import React from 'react';
import { ICliente } from '../../../Interface/ICliente';

interface ClienteItemProps {
  cliente: ICliente;
}

const ClienteItem: React.FC<ClienteItemProps> = ({ cliente }) => {
  return (
    <div>
      <h2>{cliente.nome}</h2>
      <p>CPF: {cliente.cpf}</p>
      <p>CNPJ: {cliente.cnpj}</p>
      <p>Email: {cliente.email}</p>
      <p>Telefone: {cliente.telefone}</p>
    </div>
  );
}

export default ClienteItem;
