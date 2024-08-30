import React from 'react';
import { IOS } from '../../../Interface/IOS';

interface OrdemServicoItemProps {
  ordem: IOS;
}

const OSItem: React.FC<OrdemServicoItemProps> = ({ ordem }) => {
  return (
    <div>
      <p>Data de Abertura: {ordem.data_abertura}</p>
      <p>Status: {ordem.status}</p>
      <p>Hardware: {ordem.hardware}</p>
      <p>Serviço: {ordem.servico}</p>
      <p>Prioridade: {ordem.prioridade}</p>
      <p>Descrição: {ordem.descricao}</p>
      <p>Cliente ID: {ordem.cliente}</p>
      <p>Usuário ID: {ordem.user}</p>
    </div>
  );
};

export default OSItem;
