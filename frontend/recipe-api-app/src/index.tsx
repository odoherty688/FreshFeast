import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Auth0Provider domain={process.env.REACT_APP_AUTH0_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/redirect`,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE!
    }}  
    useRefreshTokens={true}
    cacheLocation={'localstorage'}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);
