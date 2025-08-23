import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import axios from 'axios'; // Adicionei o axios
import '../styles/Login.css';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError('');

  if (!email || !password) {
    setError('Email e senha são obrigatórios');
    setLoading(false);
    return;
  }

  try {
    const endpoint = userType === 'colaborador' 
      ? 'http://localhost:3001/auth/colaborador' 
      : 'http://localhost:3001/auth/cliente';

    const response = await axios.post(endpoint, { 
      email, 
      senha: password 
    });

    if (response.data.token) {
      console.log('Response Data:', response.data); // Add this line
      const userData = {
        tipoUsuario: userType,
        email: response.data.email,
        token: response.data.token,
        nome: response.data.nome,
        id: userType === 'colaborador' 
          ? response.data.colaborador?.id 
          : response.data.cliente?.id
      };

      login(userData);
      navigate(userType === 'colaborador' ? '/consultar-cliente' : '/');
    } else {
      setError('Credenciais inválidas');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Erro ao fazer login');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <div className='container'>
        <section className="login-section">
          <h2>Entre em sua conta!</h2>
          <div className="user-type">
            <label className='radio-label'>
              <input 
                type='radio' 
                name="user-type" 
                value="cliente"
                checked={userType === 'cliente'} 
                onChange={() => setUserType('cliente')} 
              />
              <span className="radio-custom"></span> Cliente
            </label>

            <label className='radio-label'>
              <input 
                type='radio' 
                name="user-type" 
                value="colaborador"
                checked={userType === 'colaborador'} 
                onChange={() => setUserType('colaborador')} 
              />
              <span className="radio-custom"></span> Colaborador
            </label>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Carregando...' : 'ENTRAR'}
            </button>
          </form>
          <p>Ainda não possui uma conta? <Link to="/cadastro-cliente">Cadastre-se</Link></p>
        </section>
      </div>
    <InfoSection />
    </div>
  );
}

export default Login;
