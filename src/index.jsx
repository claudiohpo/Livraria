import React from 'react';
import { createRoot } from 'react-dom/client'; // Importe createRoot
import App from './App';
import { CarrinhoProvider } from './context/CarrinhoContext'; 
import axios from 'axios';

// Crie a raiz do aplicativo
const container = document.getElementById('root');
const root = createRoot(container);


// Renderize o aplicativo
root.render(
	<React.StrictMode>
		<CarrinhoProvider>
			<App />
		</CarrinhoProvider>
	</React.StrictMode>
);
