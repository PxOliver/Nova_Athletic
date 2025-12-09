// Importa React para poder utilizar JSX y componentes.
import React from 'react';
// Importa ReactDOM para renderizar la aplicación en el DOM.
import ReactDOM from 'react-dom/client';

// Importa el archivo de estilos CSS principal.
import './index.css';

// Importa el componente principal de la aplicación.
import App from './App';

// Importa la función reportWebVitals para medir el rendimiento de la aplicación.
import reportWebVitals from './reportWebVitals';

// Importa el contexto de autenticación para manejar la sesión del usuario.
import { AuthProvider } from './Componentes/AuthContext';

// Importa el contexto del carrito de compras para manejar la gestión del carrito.
import { CartProvider } from "./Componentes/CartContext";

import "bootstrap/dist/css/bootstrap.min.css";

// Crea la raíz de la aplicación en el elemento con el id 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro del modo estricto de React.
root.render(
  <React.StrictMode>
    {/* Proporciona el contexto de autenticación a toda la aplicación */}
    <AuthProvider>
      {/* Proporciona el contexto del carrito a toda la aplicación */}
      <CartProvider>
        {/* Renderiza el componente principal de la aplicación */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();