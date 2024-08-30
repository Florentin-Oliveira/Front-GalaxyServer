import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './contexts';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './global.module.scss'

ReactDOM.render(
  <AppThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppThemeProvider>,
  document.getElementById('root')
);
