import './App.css';
import './stylesheets/Home.css';
import './stylesheets/logo.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';
import VerificationPage from './Componentes/VerificationPage';
import Home from './views/Home';
import Layout from './views/Layout';
import ProductDetail from './views/ProductDetail';
import Perfil from './views/Perfil';
import ProtectedRoute from './Componentes/ProtectedRoute';
import AdminDashboard from './Componentes/AdminDashboard';
import Ayuda from './views/Ayuda';
import Checkout from "./views/Checkout";
import OrderDetails from "./views/OrderDetails";
import Cart from "./Componentes/Cart";
import MisOrdenes from "./views/MisOrdenes";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas dentro del Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />

            <Route element={<ProtectedRoute />}>
            <Route path='/perfil' element={<Perfil />}/>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orden/:id" element={<OrderDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/mis-ordenes" element={<MisOrdenes />} />
            </Route>
          </Route>

          {/* Rutas fuera del Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* 👈 NUEVA */}
          <Route path="/ayuda" element={<Ayuda />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;