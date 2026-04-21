import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CitySearch from '../components/CitySearch.jsx';

vi.mock('../main.jsx', () => ({ renderApp: vi.fn() }));
import { renderApp } from '../main.jsx';

const cities = ['Минск', 'Москва', 'Лондон'];

describe('CitySearch', () => {
  it('рендерит поле ввода', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    expect(screen.getByPlaceholderText(/введите город/i)).toBeInTheDocument();
  });

  it('рендерит кнопку поиска', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    expect(screen.getByLabelText(/найти/i)).toBeInTheDocument();
  });

  it('рендерит кнопки городов', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    expect(screen.getByText('Минск')).toBeInTheDocument();
    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('Лондон')).toBeInTheDocument();
  });

  it('активный город имеет класс --active', () => {
    render(<CitySearch cities={cities} selected="Москва" />);
    expect(screen.getByText('Москва').className).toContain('city-search__city-btn--active');
  });

  it('вызывает renderApp при клике на город', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    fireEvent.click(screen.getByText('Москва'));
    expect(renderApp).toHaveBeenCalledWith('Москва');
  });

  it('вызывает renderApp при нажатии Enter в поле', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    const input = screen.getByPlaceholderText(/введите город/i);
    fireEvent.change(input, { target: { value: 'Лондон' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(renderApp).toHaveBeenCalledWith('Лондон');
  });

  it('рендерит подсказки через datalist', () => {
    render(<CitySearch cities={cities} selected="Минск" />);
    expect(document.getElementById('city-suggestions')).toBeInTheDocument();
  });
});
