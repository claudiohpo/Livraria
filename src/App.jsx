import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthLogin';
import RotaProtegida from './components/RotaProtegida';
import Home from './pages/Home.jsx';
import ShopLivros from './pages/ShopLivros.jsx';
import IaRecomenda from './pages/IARecomenda.jsx';
import Login from './pages/Login.jsx';
import CadastroCliente from './pages/CadastroCliente.jsx';
import ConsultaClientes from './pages/colaborador/ConsultaClientes.jsx';
import EditarCliente from './pages/colaborador/EditarCliente.jsx';
import ConsultaLivros from './pages/colaborador/ConsultaLivros.jsx';
import TelaProduto from './pages/TelaProduto.jsx';
import Perfil from './pages/Perfil.jsx';
import Carrinho from './pages/Carrinho.jsx';
import Pagamento from './pages/Pagamento.jsx';
import TransacoesCliente from './pages/colaborador/TransacoesCliente.jsx';
import './App.css';

// Exemplo no index.js ou App.js (React)
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/livros" element={<ShopLivros />} />
            <Route path="/ia-recomenda" element={<IaRecomenda />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/unauthorized" element={<Navigate to="/login" replace />} />

            {/* Rotas protegidas */}
            <Route
              path="/consultar-cliente"
              element={
                <RotaProtegida requiredUserType="colaborador">
                  <ConsultaClientes />
                </RotaProtegida>
              }
            />
            <Route
              path="/consultar-cliente/editar-cliente/:id"
              element={
                <RotaProtegida requiredUserType="colaborador">
                  <EditarCliente />
                </RotaProtegida>
              }
            />
            <Route
              path="/consultar-livros"
              element={
                <RotaProtegida requiredUserType="colaborador">
                  <ConsultaLivros />
                </RotaProtegida>
              }
            />
            <Route
              path="/transacoes-cliente"
              element={
                <RotaProtegida requiredUserType="colaborador">
                  <TransacoesCliente />
                </RotaProtegida>
              }
            />
            <Route 
              path="/perfil" 
              element={
                <RotaProtegida requiredUserType="cliente">
                  <Perfil />
                </RotaProtegida>
              } 
            />
            <Route 
              path="/carrinho" 
              element={
                <RotaProtegida requiredUserType="cliente">
                  <Carrinho />
                </RotaProtegida>
              } 
            />
            <Route 
              path="/pagamento" 
              element={
                <RotaProtegida requiredUserType="cliente">
                  <Pagamento />
                </RotaProtegida>
              } 
            />
            <Route path="/tela-produto/:id" element={<TelaProduto />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;