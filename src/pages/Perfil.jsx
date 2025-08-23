import React, { useState, useEffect } from 'react';
import '../styles/Perfil.css';
import axios from 'axios';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import { useNavigate } from 'react-router-dom';
import MeusProdutos from '../components/MeusProdutos.jsx';
import AbasFiltro from '../components/AbasFiltro.jsx';
import InfoSection from '../components/InfoSection.jsx';

function Perfil() {
  // Hooks must be called at the top level
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State declarations
  const [abaAtiva, setAbaAtiva] = useState('Perfil');
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [ufSelecionada, setUfSelecionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeSocial: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    genero: 'MASCULINO',
    tipoResidencia: 'RESIDENCIAL',
    tipoLogradouro: 'Avenida',
    logradouro: '',
    numero: '',
    cep: '',
    cidade: '',
    uf: '',
    bairro: '',
    complemento: '',
    observacoes: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const abas = [
    { id: 'Perfil', label: 'Perfil' },
    { id: 'MeusProdutos', label: 'Meus Produtos' },
    { id: 'Comunidade', label: 'Comunidade' }
  ];

  // Helper functions
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Se a data já estiver no formato ISO (YYYY-MM-DD), retorne diretamente
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    // Caso contrário, tente converter
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Verifica se a data é válida
    return date.toISOString().split('T')[0];
  };

  const getTipoLogradouro = (logradouro) => {
    if (!logradouro) return 'Avenida';
    if (logradouro.startsWith('Rua')) return 'Rua';
    if (logradouro.startsWith('Avenida')) return 'Avenida';
    if (logradouro.startsWith('Travessa')) return 'Travessa';
    if (logradouro.startsWith('Alameda')) return 'Alameda';
    return 'Avenida';
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    return numeros.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const formatarCEP = (cep) => {
    if (!cep) return '';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Data fetching
  useEffect(() => {
    console.log('Iniciando busca de dados...');
    setLoading(true);
    setError(null);
  
    if (!user?.id) {
      console.log('Usuário não autenticado ou ID não disponível');
      setLoading(false);
      return;
    }
  
    const token = localStorage.getItem('authToken');
  
    // Primeiro verifica o token
    axios.get(`http://localhost:3001/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      // Se o token é válido, busca os dados do cliente
      return axios.get(`http://localhost:3001/clientes/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    })
    .then((response) => {
      const cliente = response.data;
      console.log('Resposta completa da API:', cliente);
  
      // Preferência para endereço de cobrança, se existir
      const endereco = cliente.enderecos?.find(e => e.tipoEndereco === "COBRANCA") || cliente.enderecos?.[0] || {};
  
      setFormData({
        nomeCompleto: cliente.nome || cliente.nomeCompleto || '',
        nomeSocial: cliente.nomeSocial || cliente.nome || '',
        dataNascimento: formatDateForInput(cliente.dataNascimento),
        cpf: cliente.cpf || '',
        telefone: cliente.telefone || '',
        genero: cliente.genero || 'MASCULINO',
        tipoResidencia: endereco.tipo || 'RESIDENCIAL',
        tipoLogradouro: getTipoLogradouro(endereco.logradouro || ''),
        logradouro: endereco.logradouro || '',
        numero: endereco.numero || '',
        cep: endereco.cep || '',
        cidade: endereco.cidade || '',
        uf: endereco.estado || '',
        bairro: endereco.bairro || '',
        complemento: endereco.complemento || '',
        observacoes: endereco.observacoes || '',
        email: cliente.email || '',
        senha: '',
        confirmacaoSenha: ''
      });
  
      if (endereco.estado) {
        setUfSelecionada(endereco.estado);
      }
  
      setLoading(false);
    })
    .catch((error) => {
      console.error("Erro detalhado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError("Erro ao carregar dados do perfil");
      setLoading(false);
      
      // Se o token for inválido, faz logout
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    });
  }, [user?.id, logout, navigate]);

  // Event handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUfChange = (e) => {
    const uf = e.target.value;
    setUfSelecionada(uf);
    setFormData(prev => ({
      ...prev,
      uf: uf
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dadosAtualizados = {
        nome: formData.nomeCompleto,
        nomeSocial: formData.nomeSocial,
        dataNascimento: formData.dataNascimento,
        telefone: formData.telefone,
        genero: formData.genero,
        email: formData.email,
        enderecos: [
          {
            tipo: formData.tipoResidencia,
            tipoEndereco: "COBRANCA",
            logradouro: formData.logradouro,
            numero: formData.numero,
            bairro: formData.bairro,
            cep: formData.cep,
            cidade: formData.cidade,
            estado: formData.uf,
            complemento: formData.complemento,
            observacoes: formData.observacoes,
            pais: "Brasil"
          }
        ]
      };
  
      if (formData.senha && formData.senha === formData.confirmacaoSenha) {
        dadosAtualizados.senha = formData.senha;
      }
  
      const response = await axios.put(`http://localhost:3001/clientes/${user.id}`, dadosAtualizados);
      
      if (response.status === 200) {
        alert('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInativarConta = () => {
    if (window.confirm('Tem certeza que deseja inativar sua conta?')) {
      logout();
      navigate('/');
    }
  };

  const handleExcluirConta = () => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente sua conta?')) {
      logout();
      navigate('/');
    }
  };

  // Loading and error states
  if (loading) {
    return <div className="perfil-container">Carregando...</div>;
  }

  if (!user) {
    return <div className="perfil-container">Usuário não autenticado</div>;
  }

  if (error) {
    return <div className="perfil-container">{error.message || error}</div>;
  }

  return (
    <div className="perfil-container">
      <Header tipoUsuario={user?.tipoUsuario} />

      <div className="perfil-content">
        <h1>Meu Perfil</h1>

        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />
      
        {abaAtiva === 'Perfil' && (
          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="perfil-dados">
              <div className="perfil-input-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-group">
                <label>Nome Social</label>
                <input
                  type="text"
                  name="nomeSocial"
                  value={formData.nomeSocial}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Data Nascimento</label>
                    <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-input-group">
                  <label>CPF</label>
                  <input
                  type="text"
                  name="cpf"
                  value={formatarCPF(formData.cpf)}
                  onChange={handleChange}
                  disabled
                />
                </div>
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formatarTelefone(formData.telefone)}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-input-group">
                  <label>Gênero</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">Prefiro não informar</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="perfil-endereco">
              <h2>Endereço de Cobrança</h2>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Tipo de Residência</label>
                  <select
                    name="tipoResidencia"
                    value={formData.tipoResidencia}
                    onChange={handleChange}
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div className="perfil-input-group">
                  <label>Tipo de Logradouro</label>
                  <select
                    name="tipoLogradouro"
                    value={formData.tipoLogradouro}
                    onChange={handleChange}
                  >
                    <option value="Rua">Rua</option>
                    <option value="Avenida">Avenida</option>
                    <option value="Travessa">Travessa</option>
                    <option value="Alameda">Alameda</option>
                  </select>
                </div>
              </div>

              <div className="perfil-input-group">
                <label>Logradouro</label>
                <input
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-input-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formatarCEP(formData.cep)}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Cidade</label>
                  <select
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    disabled={!ufSelecionada}
                  >
                    <option value="">Selecione...</option>
                    {cidades.map(cidade => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="perfil-input-group">
                  <label>UF</label>
                  <select
                    name="uf"
                    value={formData.uf}
                    onChange={handleUfChange}
                  >
                    <option value="">Selecione...</option>
                    {ufs.map(uf => (
                      <option key={uf.id} value={uf.sigla}>
                        {uf.sigla}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="perfil-input-group">
                <label>Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-group">
                <label>Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="perfil-login">
              <h2>Dados de Login</h2>

              <div className="perfil-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                  />
                </div>

                <div className="perfil-input-group">
                  <label>Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmacaoSenha"
                    value={formData.confirmacaoSenha}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="perfil-botoes">
              <button type="submit" className="perfil-botao-editar">EDITAR</button>
              <button type="button" onClick={handleCancel} className="perfil-botao-cancelar">CANCELAR</button>
            </div>

            <div className="perfil-conta-acoes">
              <button onClick={handleLogout} >Sair da Conta</button>
              <button onClick={handleInativarConta}>Inativar Conta</button>
              <button onClick={handleExcluirConta} className="perfil-botao-excluir">Excluir Conta</button>
              <button>Contatar Suporte</button>
            </div>
          </form>
        )}

        {abaAtiva === 'MeusProdutos' && (
          <MeusProdutos />
        )}

        {abaAtiva === 'Comunidade' && (
          <div className="perfil-comunidade">
            <h2>Comunidade</h2>
            <p>Em breve você poderá interagir com a comunidade.</p>
          </div>
        )}
      </div>
    <InfoSection />
    </div>
  );
}

export default Perfil;
