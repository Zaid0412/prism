import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './features/app/components/App';
import { Provider } from 'react-redux';
import { store } from './app/store';

export { Sidebar } from './features/sidebar/components/Sidebar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
