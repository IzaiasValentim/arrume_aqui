import React, { useState } from 'react';

// Componente da página de Login do Administrador
const Login = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' ou 'error'

  // Função para exibir o modal personalizado
  const showCustomModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeCustomModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('');
  };

  // Manipula o envio do formulário de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de login com credenciais fixas
    // Em uma aplicação real, aqui haveria uma chamada à API de autenticação
    if ((email === 'email@example.com' && password === 'password@') || (email === 'a' && password === 'a')) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula atraso da autenticação
      showCustomModal('Login realizado com sucesso!', 'success');
      // Em um cenário real, você armazenaria um token de autenticação e redirecionaria
      navigate('/admin'); // Redireciona para o painel de administração
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula atraso
      showCustomModal('Credenciais inválidas. Tente novamente.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 p-md-4 p-lg-5" style={{
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)', // Gradiente de fundo iOS
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
      {/* Font Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background overlay para efeito de transparência sutil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.15)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="card p-4 p-md-5 rounded-5 shadow-lg" style={{
        background: 'rgba(255, 255, 255, 0.85)', // Fundo com transparência
        backdropFilter: 'blur(15px) saturate(180%)', // Efeito glassmorphism
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxWidth: '500px', // Largura máxima para o formulário de login
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 className="h4 text-dark mb-4 text-center">Realize o seu Login</h2>
        <form onSubmit={handleLogin}>
          {/* Campo de E-mail */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark">E-mail</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-dark">Senha</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password@"
              style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </div>

          {/* Botão de Login */}
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill shadow-lg animate-button"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #007bff, #0056b3)', // Gradiente azul para login
                border: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 15px rgba(0, 123, 255, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 123, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 123, 255, 0.4)';
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          {/* Botão Voltar */}
          <div className="text-center">
            <button className="btn btn-link text-decoration-none text-primary fw-bold" onClick={() => navigate('/')}
              style={{
                transition: 'color 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0056b3';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#007bff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Voltar para a Página Inicial
            </button>
          </div>
        </form>
      </div>

      {/* Custom Modal for Success/Error */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-lg shadow-lg" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            }}>
              <div className="modal-header border-0 pb-0">
                <h5 className={`modal-title text-${modalType === 'success' ? 'success' : 'danger'} fw-bold`}>
                  {modalType === 'success' ? 'Sucesso!' : 'Erro!'}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomModal}></button>
              </div>
              <div className="modal-body pt-0">
                <p className="text-dark">{modalMessage}</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className={`btn rounded-pill ${modalType === 'success' ? 'btn-success' : 'btn-danger'}`} onClick={closeCustomModal}>
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
