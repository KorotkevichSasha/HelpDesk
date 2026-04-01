import { describe, it, expect } from 'vitest';
import { convertTemperature, formatWindSpeed, getWindDescription } from '../utils/weather.js';

describe('convertTemperature', () => {
  it('C → F: 0°C = 32°F', () => {
    expect(convertTemperature(0, 'C', 'F')).toBe(32);
  });
  it('C → F: 100°C = 212°F', () => {
    expect(convertTemperature(100, 'C', 'F')).toBe(212);
  });
  it('F → C: 32°F = 0°C', () => {
    expect(convertTemperature(32, 'F', 'C')).toBe(0);
  });
  it('C → K: 0°C = 273.2K', () => {
    expect(convertTemperature(0, 'C', 'K')).toBe(273.2);
  });
  it('K → C: 273.15K = 0°C', () => {
    expect(convertTemperature(273.15, 'K', 'C')).toBe(0);
  });
  it('одинаковые единицы возвращают то же значение', () => {
    expect(convertTemperature(25, 'C', 'C')).toBe(25);
  });
  it('отрицательные температуры: -40°C = -40°F', () => {
    expect(convertTemperature(-40, 'C', 'F')).toBe(-40);
  });
});

describe('formatWindSpeed', () => {
  it('м/с по умолчанию', () => {
    expect(formatWindSpeed(5.5)).toBe('5.5 м/с');
  });
  it('конвертация в км/ч', () => {
    expect(formatWindSpeed(10, 'kmh')).toBe('36.0 км/ч');
  });
  it('конвертация в mph', () => {
    expect(formatWindSpeed(10, 'mph')).toBe('22.4 mph');
  });
  it('NaN возвращает —', () => {
    expect(formatWindSpeed(NaN)).toBe('—');
  });
  it('0 м/с', () => {
    expect(formatWindSpeed(0)).toBe('0.0 м/с');
  });
});

describe('getWindDescription', () => {
  it('штиль при 0 м/с', () => {
    expect(getWindDescription(0)).toBe('Штиль');
  });
  it('умеренный при 6 м/с', () => {
    expect(getWindDescription(6)).toBe('Умеренный');
  });
  it('шторм при 20 м/с', () => {
    expect(getWindDescription(20)).toBe('Шторм');
  });
});
