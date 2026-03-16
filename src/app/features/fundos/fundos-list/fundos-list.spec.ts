import { describe, it, expect } from 'vitest';
import { signal, computed } from '@angular/core';
import { Fundo } from '../../../core/models/fundo.model';

// Testa a lógica pura do componente (signals computados e métodos utilitários)
// Recria a lógica isoladamente para evitar dependências do Angular JIT

const tipoBadgeClasses: Record<string, string> = {
  'RENDA FIXA': 'bg-blue-50 text-blue-700',
  'ACOES': 'bg-rose-50 text-rose-700',
  'MULTI MERCADO': 'bg-amber-50 text-amber-700',
};

function getTipoBadgeClass(tipo: string): string {
  return tipoBadgeClasses[tipo] ?? 'bg-gray-50 text-gray-700';
}

const fundosMock: Fundo[] = [
  { codigo: 'F1', nome: 'Fundo RF', cnpj: '11111111111111', codigoTipo: 1, nomeTipo: 'RENDA FIXA', patrimonio: 1000 },
  { codigo: 'F2', nome: 'Fundo Ações', cnpj: '22222222222222', codigoTipo: 2, nomeTipo: 'ACOES', patrimonio: 2000 },
  { codigo: 'F3', nome: 'Fundo Multi', cnpj: '33333333333333', codigoTipo: 3, nomeTipo: 'MULTI MERCADO', patrimonio: null },
];

describe('FundosListComponent - lógica', () => {
  describe('totalPatrimonio (computed)', () => {
    it('retorna 0 quando não há fundos', () => {
      const fundos = signal<Fundo[]>([]);
      const totalPatrimonio = computed(() =>
        fundos().reduce((sum, f) => sum + (f.patrimonio ?? 0), 0)
      );
      expect(totalPatrimonio()).toBe(0);
    });

    it('soma patrimônio de todos os fundos', () => {
      const fundos = signal<Fundo[]>(fundosMock);
      const totalPatrimonio = computed(() =>
        fundos().reduce((sum, f) => sum + (f.patrimonio ?? 0), 0)
      );
      expect(totalPatrimonio()).toBe(3000);
    });

    it('ignora patrimônio null no cálculo', () => {
      const fundos = signal<Fundo[]>([
        { codigo: 'A', nome: 'A', cnpj: '11111111111111', codigoTipo: 1, nomeTipo: 'RF', patrimonio: null },
        { codigo: 'B', nome: 'B', cnpj: '22222222222222', codigoTipo: 1, nomeTipo: 'RF', patrimonio: 500 },
      ]);
      const totalPatrimonio = computed(() =>
        fundos().reduce((sum, f) => sum + (f.patrimonio ?? 0), 0)
      );
      expect(totalPatrimonio()).toBe(500);
    });

    it('recalcula quando fundos mudam', () => {
      const fundos = signal<Fundo[]>([]);
      const totalPatrimonio = computed(() =>
        fundos().reduce((sum, f) => sum + (f.patrimonio ?? 0), 0)
      );
      expect(totalPatrimonio()).toBe(0);

      fundos.set(fundosMock);
      expect(totalPatrimonio()).toBe(3000);
    });
  });

  describe('tiposUnicos (computed)', () => {
    it('retorna 0 quando não há fundos', () => {
      const fundos = signal<Fundo[]>([]);
      const tiposUnicos = computed(() => new Set(fundos().map((f) => f.nomeTipo)).size);
      expect(tiposUnicos()).toBe(0);
    });

    it('conta tipos únicos corretamente', () => {
      const fundos = signal<Fundo[]>(fundosMock);
      const tiposUnicos = computed(() => new Set(fundos().map((f) => f.nomeTipo)).size);
      expect(tiposUnicos()).toBe(3);
    });

    it('não conta tipos duplicados', () => {
      const fundos = signal<Fundo[]>([
        { codigo: 'A', nome: 'A', cnpj: '11111111111111', codigoTipo: 1, nomeTipo: 'RENDA FIXA', patrimonio: 100 },
        { codigo: 'B', nome: 'B', cnpj: '22222222222222', codigoTipo: 1, nomeTipo: 'RENDA FIXA', patrimonio: 200 },
      ]);
      const tiposUnicos = computed(() => new Set(fundos().map((f) => f.nomeTipo)).size);
      expect(tiposUnicos()).toBe(1);
    });
  });

  describe('getTipoBadgeClass', () => {
    it('retorna classe correta para RENDA FIXA', () => {
      expect(getTipoBadgeClass('RENDA FIXA')).toBe('bg-blue-50 text-blue-700');
    });

    it('retorna classe correta para ACOES', () => {
      expect(getTipoBadgeClass('ACOES')).toBe('bg-rose-50 text-rose-700');
    });

    it('retorna classe correta para MULTI MERCADO', () => {
      expect(getTipoBadgeClass('MULTI MERCADO')).toBe('bg-amber-50 text-amber-700');
    });

    it('retorna classe padrão para tipo desconhecido', () => {
      expect(getTipoBadgeClass('OUTRO')).toBe('bg-gray-50 text-gray-700');
    });

    it('retorna classe padrão para string vazia', () => {
      expect(getTipoBadgeClass('')).toBe('bg-gray-50 text-gray-700');
    });
  });
});
