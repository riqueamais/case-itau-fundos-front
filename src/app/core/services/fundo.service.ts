import { Injectable } from '@angular/core';
import axios from 'axios';
import {
  Fundo,
  CreateFundoRequest,
  UpdateFundoRequest,
  UpdatePatrimonioRequest,
} from '../models/fundo.model';

const api = axios.create({
  baseURL: 'https://localhost:5001/api/fundo',
});

@Injectable({ providedIn: 'root' })
export class FundoService {
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
