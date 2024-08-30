import React from 'react';
import { IAnexo } from '../../../Interface/IAnexo';


interface Props {
  anexo: IAnexo;
}

const AnexoItem: React.FC<Props> = ({ anexo }) => {
  return (
    <div>
      <p>Ordem ID: {anexo.ordem}</p>
      <a href={anexo.arquivo} download>Download Arquivo</a>
    </div>
  );
};

export default AnexoItem;