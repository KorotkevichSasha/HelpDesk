import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

window.__renderApp = function(city = 'Минск', unit = 'C', geoStatus = '') {
  root.render(<App selectedCity={city} unit={unit} geoStatus={geoStatus} />);
};

export function renderApp(city) {
  window.__renderApp(city, 'C', '');
}

window.__renderApp('Минск', 'C', '');
