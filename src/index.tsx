import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './features/app/components/App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkFrontendApi =
  'pk_test_cHJvcGVyLXF1YWlsLTIxLmNsZXJrLmFjY291bnRzLmRldiQ';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </React.StrictMode>,
);
