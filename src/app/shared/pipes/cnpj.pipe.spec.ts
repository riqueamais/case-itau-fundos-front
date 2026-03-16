import { describe, it, expect } from 'vitest';
import { CnpjPipe } from './cnpj.pipe';

describe('CnpjPipe', () => {
  const pipe = new CnpjPipe();

  it('formata CNPJ de 14 dígitos corretamente', () => {
    expect(pipe.transform('12345678000195')).toBe('12.345.678/0001-95');
  });

  it('retorna valor original quando não tem 14 dígitos', () => {
    expect(pipe.transform('12345')).toBe('12345');
  });

  it('retorna string vazia quando valor é vazio', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('retorna valor original quando é null/undefined', () => {
    expect(pipe.transform(null as any)).toBe(null);
    expect(pipe.transform(undefined as any)).toBe(undefined);
  });

  it('formata outro CNPJ válido corretamente', () => {
    expect(pipe.transform('00000000000000')).toBe('00.000.000/0000-00');
  });

  it('retorna valor com 13 dígitos sem formatar', () => {
    expect(pipe.transform('1234567890123')).toBe('1234567890123');
  });

  it('retorna valor com 15 dígitos sem formatar', () => {
    expect(pipe.transform('123456789012345')).toBe('123456789012345');
  });
});
