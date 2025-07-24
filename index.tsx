
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppManager from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppManager />
  </React.StrictMode>
);
