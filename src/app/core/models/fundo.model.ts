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

export interface TipoFundo {
  codigo: number;
  nome: string;
}
