export interface ICliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  cnpj?: string;
}