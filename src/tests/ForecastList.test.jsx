import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForecastList from '../components/ForecastList.jsx';

const mockForecast = [
  { date: 'Пн', temp_min: 8,  temp_max: 13, icon: '02d', description: 'Облачно' },
  { date: 'Вт', temp_min: 6,  temp_max: 10, icon: '10d', description: 'Дождь' },
  { date: 'Ср', temp_min: 5,  temp_max: 9,  icon: '13d', description: 'Снег' },
];

describe('ForecastList', () => {
  it('рендерит все дни прогноза', () => {
    render(<ForecastList forecast={mockForecast} />);
    expect(screen.getByText('Пн')).toBeInTheDocument();
    expect(screen.getByText('Вт')).toBeInTheDocument();
    expect(screen.getByText('Ср')).toBeInTheDocument();
  });
  it('отображает описания погоды', () => {
    render(<ForecastList forecast={mockForecast} />);
    expect(screen.getByText('Облачно')).toBeInTheDocument();
    expect(screen.getByText('Дождь')).toBeInTheDocument();
  });
  it('отображает максимальную температуру', () => {
    render(<ForecastList forecast={mockForecast} />);
    expect(screen.getByText(/\+13/)).toBeInTheDocument();
  });
  it('отображает минимальную температуру', () => {
    render(<ForecastList forecast={mockForecast} />);
    expect(screen.getByText(/\+8/)).toBeInTheDocument();
  });
  it('рендерит иконки для каждого дня', () => {
    render(<ForecastList forecast={mockForecast} />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });
});
