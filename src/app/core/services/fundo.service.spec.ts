import { describe, it, expect } from 'vitest';
import { FundoService } from './fundo.service';

describe('FundoService', () => {
  describe('formatTipo', () => {
    let service: FundoService;

    // FundoService.formatTipo é um método puro, podemos instanciar diretamente
    // sem o Angular DI já que não depende de injeções para este método
    service = Object.create(FundoService.prototype);

    it('converte RENDA FIXA para Renda Fixa', () => {
      expect(service.formatTipo('RENDA FIXA')).toBe('Renda Fixa');
    });

    it('converte ACOES para Ações', () => {
      expect(service.formatTipo('ACOES')).toBe('Ações');
    });

    it('converte MULTI MERCADO para Multimercado', () => {
      expect(service.formatTipo('MULTI MERCADO')).toBe('Multimercado');
    });

    it('retorna o nome original se não estiver no mapeamento', () => {
      expect(service.formatTipo('OUTRO TIPO')).toBe('OUTRO TIPO');
    });

    it('retorna string vazia se receber string vazia', () => {
      expect(service.formatTipo('')).toBe('');
    });
  });
});
