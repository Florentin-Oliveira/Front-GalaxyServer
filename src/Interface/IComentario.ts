import { IUser } from './IUser';

export interface IComentario {
  id: number;
  ordem: number; 
  texto: string;
  data_comentario: string; 
  usuario: IUser;  
}