// اعمال تم قبل از رندر برای جلوگیری از پرش
const savedTheme = localStorage.getItem('luma_theme');
if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark');
} else {
  // پیش‌فرض: تاریک
  document.documentElement.classList.add('dark');
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);