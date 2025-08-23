import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      try {
        // Verifica se o token ainda é válido
        const response = await axios.get('http://localhost:3001/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Atualiza o estado com os dados do usuário salvos
          setUser(JSON.parse(userData));
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('authToken', userData.token);
    // Salva também os dados do usuário para não precisar fazer nova requisição
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);