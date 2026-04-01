import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../components/WeatherCard.jsx';

const mockData = {
  city: 'Минск', country: 'BY',
  temp: 12, feels_like: 9,
  humidity: 74, wind: 4.2,
  description: 'Переменная облачность',
  icon: '02d', dt: Date.now(),
};

describe('WeatherCard', () => {
  it('отображает название города', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText(/Минск/)).toBeInTheDocument();
  });
  it('отображает страну', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText(/BY/)).toBeInTheDocument();
  });
  it('отображает температуру', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText(/\+12/)).toBeInTheDocument();
  });
  it('отображает влажность', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('74%')).toBeInTheDocument();
  });
  it('отображает описание погоды', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText(/переменная облачность/i)).toBeInTheDocument();
  });
  it('отображает иконку погоды', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByAltText(/переменная облачность/i)).toBeInTheDocument();
  });
});
