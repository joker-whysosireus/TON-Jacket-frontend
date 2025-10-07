import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {TonConnectUIProvider} from "@tonconnect/ui-react"

const manifestUrl = 'https://github.com/joker-whysosireus/manifest-info-tonjacket/blob/main/manifest.txt';

const root = createRoot(document.getElementById('root'));
root.render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
  </TonConnectUIProvider>
);