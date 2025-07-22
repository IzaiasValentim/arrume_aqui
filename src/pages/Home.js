import React, { useState, useEffect, useRef } from 'react'; // Importa useRef
import DenunciaCard from '../components/DenunciaCard';
import { getReports, getReportByTrackingCode } from '../data/initialSimualtedReports';

// Componente da página inicial
const Home = ({ navigate }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest'); // 'latest' ou 'search'
  const [trackingCode, setTrackingCode] = useState('');
  const [foundReport, setFoundReport] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  // Estados para controlar a visibilidade e transição das seções
  const [showLatestContent, setShowLatestContent] = useState(true);
  const [showSearchContent, setShowSearchContent] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState('auto'); // Estado para a altura dinâmica do wrapper

  // Referências para as seções de conteúdo para medir suas alturas
  const latestContentRef = useRef(null);
  const searchContentRef = useRef(null);

  // Carrega denúncias do array centralizado para a aba 'latest'
  useEffect(() => {
    if (activeTab === 'latest') {
      setLoading(true);
      const timer = setTimeout(() => {
        const simulatedReports = getReports();
        setReports(simulatedReports.slice(0, 5)); // Mostra apenas as 5 denúncias mais recentes
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Efeito para gerenciar a transição entre as abas e ajustar a altura do wrapper
  useEffect(() => {
    let timerShow, timerHide;

    const updateHeight = () => {
      // Mede a altura da seção ativa e define a altura do wrapper
      let targetHeight = '400px'; // Altura padrão ou mínima
      if (activeTab === 'latest' && latestContentRef.current) {
        // Adiciona um padding extra para garantir que o footer não sobreponha
        targetHeight = `${latestContentRef.current.scrollHeight + 40}px`;
      } else if (activeTab === 'search' && searchContentRef.current) {
        // Adiciona um padding extra para garantir que o footer não sobreponha
        targetHeight = `${searchContentRef.current.scrollHeight + 40}px`;
      }
      setWrapperHeight(targetHeight);
    };

    // Lógica de transição e medição de altura
    if (activeTab === 'latest') {
      setShowSearchContent(false); // Inicia o fade-out da busca
      timerHide = setTimeout(() => {
        setShowLatestContent(true); // Mostra o conteúdo das últimas denúncias
        // Pequeno atraso para garantir que o conteúdo esteja renderizado antes de medir a altura
        timerShow = setTimeout(updateHeight, 50);
      }, 300); // Espera o fade-out da seção de busca
    } else if (activeTab === 'search') {
      setShowLatestContent(false); // Inicia o fade-out das últimas denúncias
      timerHide = setTimeout(() => {
        setShowSearchContent(true); // Mostra o conteúdo da busca
        // Pequeno atraso para garantir que o conteúdo esteja renderizado antes de medir a altura
        timerShow = setTimeout(updateHeight, 50);
      }, 300); // Espera o fade-out da seção das últimas denúncias
    }

    // Define a altura inicial e adiciona um listener para redimensionamento da janela
    updateHeight(); // Chama para definir a altura inicial
    window.addEventListener('resize', updateHeight);

    // Função de limpeza para remover timers e event listeners
    return () => {
      clearTimeout(timerHide);
      clearTimeout(timerShow);
      window.removeEventListener('resize', updateHeight);
    };
  }, [activeTab, reports, foundReport, loading]); // Dependências para re-executar o efeito (dados, estado de carregamento)

  // Função para lidar com a busca de denúncias
  const handleSearch = (e) => {
    e.preventDefault();
    setFoundReport(null);
    setSearchMessage('');

    if (!trackingCode) {
      setSearchMessage('Por favor, digite um código de acompanhamento.');
      return;
    }

    const report = getReportByTrackingCode(trackingCode);
    if (report) {
      setFoundReport(report);
      setSearchMessage('');
    } else {
      setSearchMessage('Nenhuma denúncia encontrada com este código.');
    }
    // Após a busca, re-mede a altura para ajustar o layout
    setTimeout(() => {
      const targetRef = activeTab === 'latest' ? latestContentRef : searchContentRef;
      if (targetRef.current) {
        setWrapperHeight(`${targetRef.current.scrollHeight + 40}px`);
      }
    }, 100); // Pequeno atraso para permitir a atualização do DOM
  };

  return (
    <div className="container-fluid min-vh-100 p-3 p-md-4 p-lg-5" style={{
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #e0f2f7 0%, #cce7f0 100%)',
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

      <header className="text-center mb-5 p-4 rounded-5 shadow-lg" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <h1 className="display-4 text-dark mb-4">Sistema de Denúncias de Problemas Urbanos</h1>
        <p className="lead text-muted">Sua voz ajuda a construir uma cidade melhor!</p>
        <button className="btn btn-primary btn-lg rounded-pill shadow-lg animate-button" onClick={() => navigate('/denunciar')}
          style={{
            background: 'linear-gradient(45deg, #007bff, #0056b3)',
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
          Fazer Denúncia Anônima
        </button>
      </header>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Navegação por abas */}
        <ul className="nav nav-pills nav-fill mb-4 p-2 rounded-pill shadow-sm mx-auto" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maxWidth: '800px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${activeTab === 'latest' ? 'active shadow-sm' : ''}`}
              onClick={() => setActiveTab('latest')}
              style={{
                background: activeTab === 'latest' ? 'linear-gradient(45deg, #007bff, #0056b3)' : 'transparent',
                color: activeTab === 'latest' ? 'white' : '#007bff',
                fontWeight: activeTab === 'latest' ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
                border: 'none',
              }}
            >
              Últimas Denúncias
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link rounded-pill ${activeTab === 'search' ? 'active shadow-sm' : ''}`}
              onClick={() => setActiveTab('search')}
              style={{
                background: activeTab === 'search' ? 'linear-gradient(45deg, #007bff, #0056b3)' : 'transparent',
                color: activeTab === 'search' ? 'white' : '#007bff',
                fontWeight: activeTab === 'search' ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
                border: 'none',
              }}
            >
              Buscar Denúncia
            </button>
          </li>
        </ul>

        {/* Conteúdo das abas com transição e altura dinâmica */}
        <div style={{ position: 'relative', height: wrapperHeight, transition: 'height 0.5s ease-in-out' }}>
          <section ref={latestContentRef} className="mb-5 p-4 rounded-5 shadow-lg" style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: showLatestContent ? 'translateX(-50%)' : 'translateX(-150%)',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '1200px',
            opacity: showLatestContent ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            visibility: showLatestContent ? 'visible' : 'hidden',
          }}>
            <h2 className="h4 text-dark mb-4 text-center">Últimas Denúncias Realizadas</h2>
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando denúncias...</span>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <p className="text-muted text-center">Nenhuma denúncia recente encontrada.</p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                {reports.map(report => (
                  <div key={report.id} className="col">
                    <DenunciaCard report={report} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section ref={searchContentRef} className="mb-5 p-4 rounded-5 shadow-lg" style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: showSearchContent ? 'translateX(-50%)' : 'translateX(150%)',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '800px',
            opacity: showSearchContent ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
            visibility: showSearchContent ? 'visible' : 'hidden',
          }}>
            <h2 className="h4 text-dark mb-4 text-center">Buscar Denúncia por Código</h2>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control rounded-pill-start"
                  placeholder="Digite o código de acompanhamento (Ex: ABC-001)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <button
                  className="btn btn-primary rounded-pill-end"
                  type="submit"
                  style={{
                    background: 'linear-gradient(45deg, #007bff, #0056b3)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Buscar
                </button>
              </div>
              {searchMessage && (
                <p className={`text-center ${foundReport ? 'text-success' : 'text-danger'} mt-2`}>
                  {searchMessage}
                </p>
              )}
            </form>

            {foundReport && (
              <div className="d-flex justify-content-center">
                <div className="col-md-8">
                  <DenunciaCard report={foundReport} />
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="text-center text-muted mt-5 py-3 border-top" style={{ position: 'relative', zIndex: 1 }}>
        <p>&copy; {new Date().getFullYear()} Sistema de Denúncias. Todos os direitos reservados.</p>
        <div className="mt-3">
          <a href="#" className="text-decoration-none text-primary fw-bold" onClick={() => navigate('/admin/login')}
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
            Área do Administrador
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;