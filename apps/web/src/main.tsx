import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { parseWebEnvironment } from './config/env';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element is missing.');
}

parseWebEnvironment(import.meta.env);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
