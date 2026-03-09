export interface Fundo {
  codigo: string;
  nome: string;
  cnpj: string;
  codigoTipo: number;
  nomeTipo: string;
  patrimonio: number | null;
}

export interface CreateFundoRequest {
  codigo: string;
  nome: string;
  cnpj: string;
  codigoTipo: number;
}

export interface UpdateFundoRequest {
  nome: string;
  cnpj: string;
  codigoTipo: number;
}

export interface UpdatePatrimonioRequest {
  valor: number;
}

export const TIPOS_FUNDO = [
  { codigo: 1, nome: 'Renda Fixa' },
  { codigo: 2, nome: 'Renda Variável' },
  { codigo: 3, nome: 'Multimercado' },
  { codigo: 4, nome: 'Cambial' },
] as const;
