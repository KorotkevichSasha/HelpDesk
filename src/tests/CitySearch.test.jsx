import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CitySearch from '../components/CitySearch.jsx';

describe('CitySearch', () => {
  it('рендерит поле ввода', () => {
    render(<CitySearch onSearch={vi.fn()} loading={false} />);
    expect(screen.getByPlaceholderText(/введите город/i)).toBeInTheDocument();
  });

  it('рендерит кнопку поиска', () => {
    render(<CitySearch onSearch={vi.fn()} loading={false} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('кнопка задизейблена при пустом поле', () => {
    render(<CitySearch onSearch={vi.fn()} loading={false} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('показывает подсказки при вводе', () => {
    render(<CitySearch onSearch={vi.fn()} loading={false} />);
    fireEvent.change(screen.getByPlaceholderText(/введите город/i), {
      target: { value: 'Мин' },
    });
    expect(screen.getByText('Минск')).toBeInTheDocument();
  });

  it('вызывает onSearch при нажатии Enter', () => {
    const onSearch = vi.fn();
    render(<CitySearch onSearch={onSearch} loading={false} />);
    const input = screen.getByPlaceholderText(/введите город/i);
    fireEvent.change(input, { target: { value: 'Минск' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('Минск');
  });

  it('вызывает onSearch при клике на подсказку', () => {
    const onSearch = vi.fn();
    render(<CitySearch onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByPlaceholderText(/введите город/i), {
      target: { value: 'Мос' },
    });
    fireEvent.click(screen.getByText('Москва'));
    expect(onSearch).toHaveBeenCalledWith('Москва');
  });

  it('поле задизейблено во время загрузки', () => {
    render(<CitySearch onSearch={vi.fn()} loading={true} />);
    expect(screen.getByPlaceholderText(/введите город/i)).toBeDisabled();
  });
});
