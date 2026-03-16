import { Injectable } from '@angular/core';
import axios from 'axios';
import {
  Fundo,
  TipoFundo,
  CreateFundoRequest,
  UpdateFundoRequest,
  UpdatePatrimonioRequest,
} from '../models/fundo.model';
import { environment } from '../../../environments/environment';

const api = axios.create({
  baseURL: `${environment.apiBaseUrl}/fundo`,
});

const tipoApi = axios.create({
  baseURL: `${environment.apiBaseUrl}/tipofundo`,
});

const TIPO_LABELS: Record<string, string> = {
  'RENDA FIXA': 'Renda Fixa',
  'ACOES': 'Ações',
  'MULTI MERCADO': 'Multimercado',
};

@Injectable({ providedIn: 'root' })
export class FundoService {
  formatTipo(nome: string): string {
    return TIPO_LABELS[nome] ?? nome;
  }

  async getTipos(): Promise<TipoFundo[]> {
    const { data } = await tipoApi.get<TipoFundo[]>('/');
    return data.map((t) => ({ ...t, nome: this.formatTipo(t.nome) }));
  }

  async getAll(): Promise<Fundo[]> {
    const { data } = await api.get<Fundo[]>('/');
    return data;
  }

  async getByCodigo(codigo: string): Promise<Fundo> {
    const { data } = await api.get<Fundo>(`/${codigo}`);
    return data;
  }

  async create(request: CreateFundoRequest): Promise<Fundo> {
    const { data } = await api.post<Fundo>('/', request);
    return data;
  }

  async update(codigo: string, request: UpdateFundoRequest): Promise<void> {
    await api.put(`/${codigo}`, request);
  }

  async delete(codigo: string): Promise<void> {
    await api.delete(`/${codigo}`);
  }

  async movimentarPatrimonio(
    codigo: string,
    request: UpdatePatrimonioRequest
  ): Promise<void> {
    await api.put(`/${codigo}/patrimonio`, request);
  }
}
