import React, { useState, useEffect } from 'react';
import { getReports, updateReport, deleteReport } from '../data/initialSimualtedReports'; // Importa as funções de manipulação de dados

// Componente do Painel de Administração
const PainelAdmin = ({ navigate }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'info', 'confirm'
  const [modalConfirmAction, setModalConfirmAction] = useState(null); // Armazena a ação a ser executada na confirmação do modal
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Carrega denúncias e configura um "listener" simulado para atualizações
  useEffect(() => {
    const loadReports = () => {
      setLoading(true);
      // Simula um atraso na carga de dados
      const timer = setTimeout(() => {
        setReports(getReports()); // Carrega as denúncias do arquivo centralizado
        setLoading(false);
      }, 500); // Atraso de 0.5 segundo para simular carregamento

      return () => clearTimeout(timer);
    };

    loadReports();

    // Em um cenário real com um backend, você teria um WebSocket ou polling aqui
    // Para simulação, podemos re-carregar periodicamente ou confiar que as funções de data
    // atualizarão o estado quando chamadas. Para este protótipo, a chamada direta às funções
    // de data e o re-render do React serão suficientes.
  }, []); // Executa apenas uma vez na montagem

  // Aplica filtros sempre que as denúncias ou os filtros mudam
  useEffect(() => {
    let currentFiltered = getReports(); // Sempre pega a versão mais recente dos dados

    if (filterType !== 'Todos') {
      currentFiltered = currentFiltered.filter(report => report.type === filterType);
    }
    if (filterStatus !== 'Todos') {
      currentFiltered = currentFiltered.filter(report => report.status === filterStatus);
    }
    setFilteredReports(currentFiltered);
    // Se o relatório selecionado não estiver mais nos relatórios filtrados, deseleciona
    if (selectedReport && !currentFiltered.some(r => r.id === selectedReport.id)) {
      setSelectedReport(null);
    }
  }, [reports, filterType, filterStatus, selectedReport]); // Adicionado selectedReport para reavaliar a seleção

  // Função para formatar o timestamp
  const formatTimestamp = (timestamp) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString(); // Formata para data e hora local
    }
    return 'N/A';
  };

  // Determina a classe CSS do badge com base no status da denúncia
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-success';
      case 'rejeitado':
        return 'bg-danger';
      case 'resolvido':
        return 'bg-primary';
      case 'em análise':
        return 'bg-info text-dark';
      default:
        return 'bg-warning text-dark'; // Status padrão (Pendente)
    }
  };

  // Função para exibir o modal personalizado
  const showCustomModal = (message, type, onConfirmAction = null) => {
    setModalMessage(message);
    setModalType(type);
    setModalConfirmAction(() => onConfirmAction);
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeCustomModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('');
    setModalConfirmAction(null);
  };

  // Função para lidar com a confirmação do modal
  const handleModalConfirm = () => {
    if (modalConfirmAction) {
      modalConfirmAction(); // Executa a ação armazenada
    }
    closeCustomModal();
    setReports(getReports()); // Força a atualização da lista de relatórios após a ação
  };

  // Função para lidar com a aprovação da denúncia
  const handleApprove = (reportId) => {
    showCustomModal(
      'Tem certeza que deseja aprovar este reporte?',
      'confirm',
      () => {
        updateReport(reportId, { status: 'aprovado' });
        showCustomModal('Reporte aprovado com sucesso!', 'info');
      }
    );
    setSelectedReport(getReports().find(report => report.id === reportId));
  };

  // Função para lidar com a rejeição da denúncia
  const handleReject = (reportId) => {
    showCustomModal(
      'Tem certeza que deseja rejeitar este reporte?',
      'confirm',
      () => {
        updateReport(reportId, { status: 'rejeitado' });
        showCustomModal('Reporte rejeitado com sucesso!', 'info');
      }
    );
    setSelectedReport(getReports().find(report => report.id === reportId));
  };

  // Função para lidar com a marcação como resolvida
  const handleResolve = (reportId) => {
    showCustomModal(
      'Tem certeza que deseja marcar este reporte como resolvido?',
      'confirm',
      () => {
        updateReport(reportId, { status: 'resolvido' });
        showCustomModal('Reporte marcado como resolvido com sucesso!', 'info');
      }
    );
    setSelectedReport(getReports().find(report => report.id === reportId));
  };

  // Função para lidar com a exclusão da denúncia
  const handleDelete = (reportId) => {
    showCustomModal(
      'Tem certeza que deseja excluir este reporte? Esta ação é irreversível.',
      'confirm',
      () => {
        deleteReport(reportId);
        showCustomModal('Reporte excluído com sucesso!', 'info');
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(null); // Limpa os detalhes se a denúncia selecionada for excluída
        }
      }
    );
    setSelectedReport(getReports().find(report => report.id === reportId));
  };

  // Logout simulado
  const handleLogout = () => {
    showCustomModal(
      'Tem certeza que deseja sair?',
      'confirm',
      () => {
        navigate('/admin/login'); // Redireciona para a página de login
      }
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <div className="ms-3 text-primary">Carregando painel de administração...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 p-3 p-md-4 p-lg-5" style={{
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

      {/* Header do Painel de Admin */}
      <header className="text-center mb-5 p-4 rounded-5 shadow-lg mx-auto" style={{
        background: 'linear-gradient(135deg, rgba(200, 230, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxWidth: '1200px', // Aumenta a largura máxima para o painel de admin
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 className="display-4 text-dark mb-3">Painel de Administração</h1>
        <p className="lead text-muted">Gerencie os reportes recebidos.</p>
        <button className="btn btn-danger rounded-pill shadow-sm animate-button mt-3" onClick={handleLogout}
          style={{
            background: 'linear-gradient(45deg, #dc3545, #c82333)',
            border: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(220, 53, 69, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(220, 53, 69, 0.3)';
          }}
        >
          Sair
        </button>
      </header>

      {/* Main Content Area */}
      <main className="row g-4 justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
        {/* Filtros */}
        <section className="col-12 mb-4">
          <div className="card p-4 rounded-5 shadow-lg" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <h3 className="h5 text-dark mb-3">Filtrar reportes</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="filterType" className="form-label text-dark">Tipo do Problema</label>
                <select
                  className="form-select rounded-pill"
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option value="Todos">Todos os Tipos</option>
                  <option value="Buraco na Rua">Buraco na Rua</option>
                  <option value="Iluminação Pública">Iluminação Pública</option>
                  <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
                  <option value="Vazamento de Água">Vazamento de Água</option>
                  <option value="Árvore Caída">Árvore Caída</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="filterStatus" className="form-label text-dark">Status</label>
                <select
                  className="form-select rounded-pill"
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em análise">Em Análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                  <option value="resolvido">Resolvido</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Denúncias */}
        <section className="col-lg-8">
          <div className="card shadow-lg rounded-5" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div className="card-body">
              <h2 className="card-title h5 text-dark mb-4">Reportes Recebidos ({filteredReports.length})</h2>
              {filteredReports.length === 0 ? (
                <p className="text-muted text-center">Nenhum reporte encontrado com os filtros aplicados.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover rounded overflow-hidden">
                    <thead className="bg-primary text-white" style={{ background: 'linear-gradient(45deg, #007bff, #0056b3)' }}>
                      <tr>
                        <th scope="col">Tipo</th>
                        <th scope="col">Localização</th>
                        <th scope="col">Status</th>
                        <th scope="col">Data</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td>{report.type || 'N/A'}</td>
                          <td>{report.location ? `${report.location.street}, ${report.location.neighborhood}` : 'N/A'}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                              {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'Pendente'}
                            </span>
                          </td>
                          <td>{formatTimestamp(report.timestamp)}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <button
                                className="btn btn-info btn-sm rounded-pill"
                                onClick={() => setSelectedReport(report)}
                                title="Ver Detalhes"
                                style={{
                                  background: 'linear-gradient(45deg, #17a2b8, #138496)',
                                  border: 'none',
                                  color: 'white'
                                }}
                              >
                                Detalhes
                              </button>
                              <button
                                className="btn btn-success btn-sm rounded-pill"
                                onClick={() => handleApprove(report.id)}
                                disabled={report.status === 'aprovado' || report.status === 'resolvido'}
                                title="Aprovar Reporte"
                                style={{
                                  background: 'linear-gradient(45deg, #28a745, #218838)',
                                  border: 'none',
                                  color: 'white'
                                }}
                              >
                                Aprovar
                              </button>
                              <button
                                className="btn btn-warning btn-sm rounded-pill text-dark"
                                onClick={() => handleReject(report.id)}
                                disabled={report.status === 'rejeitado' || report.status === 'resolvido'}
                                title="Rejeitar Reporte"
                                style={{
                                  background: 'linear-gradient(45deg, #ffc107, #e0a800)',
                                  border: 'none',
                                  color: 'black'
                                }}
                              >
                                Rejeitar
                              </button>
                              <button
                                className="btn btn-primary btn-sm rounded-pill"
                                onClick={() => handleResolve(report.id)}
                                disabled={report.status === 'resolvido'}
                                title="Marcar como Resolvida"
                                style={{
                                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                                  border: 'none',
                                  color: 'white'
                                }}
                              >
                                Resolver
                              </button>
                              <button
                                className="btn btn-danger btn-sm rounded-pill"
                                onClick={() => handleDelete(report.id)}
                                title="Excluir Reporte"
                                style={{
                                  background: 'linear-gradient(45deg, #dc3545, #c82333)',
                                  border: 'none',
                                  color: 'white'
                                }}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detalhes da Denúncia */}
        <section className="col-lg-4">
          <div className="card shadow-lg rounded-5" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <div className="card-body">
              <h2 className="card-title h5 text-dark mb-4">Detalhes do Reporte</h2>
              {selectedReport ? (
                <div>
                  <p><strong>ID:</strong> {selectedReport.id}</p>
                  <p><strong>Tipo:</strong> {selectedReport.type || 'N/A'}</p>
                  <p><strong>Descrição:</strong> {selectedReport.description || 'N/A'}</p>
                  <p><strong>Localização:</strong> {selectedReport.location ? `${selectedReport.location.street}, ${selectedReport.location.neighborhood}, ${selectedReport.location.number}, CEP: ${selectedReport.location.cep}` : 'N/A'}</p>
                  <p><strong>Status:</strong> <span className={`badge ${getStatusBadgeClass(selectedReport.status)}`}>{selectedReport.status ? selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1) : 'Pendente'}</span></p>
                  <p><strong>Data/Hora:</strong> {formatTimestamp(selectedReport.timestamp)}</p>
                  {selectedReport.imageUrl && (
                    <div className="mb-3">
                      <strong>Foto:</strong>
                      <img
                        src={selectedReport.imageUrl}
                        alt="Evidência do Reporte"
                        className="img-fluid rounded mt-2 shadow-sm"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.75rem' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/cccccc/333333?text=Imagem+N%C3%A3o+Dispon%C3%ADvel"; }}
                      />
                    </div>
                  )}
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-secondary btn-sm rounded-pill" onClick={() => setSelectedReport(null)}
                      style={{
                        background: 'linear-gradient(45deg, #6c757d, #5a6268)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      Fechar Detalhes
                    </button>
                    {/* Botões de ação rápida nos detalhes */}
                    <button
                      className="btn btn-success btn-sm rounded-pill"
                      onClick={() => handleApprove(selectedReport.id)}
                      disabled={selectedReport.status === 'aprovado' || selectedReport.status === 'resolvido'}
                      title="Aprovar Reporte"
                      style={{
                        background: 'linear-gradient(45deg, #28a745, #218838)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      Aprovar
                    </button>
                    <button
                      className="btn btn-warning btn-sm rounded-pill text-dark"
                      onClick={() => handleReject(selectedReport.id)}
                      disabled={selectedReport.status === 'rejeitado' || selectedReport.status === 'resolvido'}
                      title="Rejeitar Reporte"
                      style={{
                        background: 'linear-gradient(45deg, #ffc107, #e0a800)',
                        border: 'none',
                        color: 'black'
                      }}
                    >
                      Rejeitar
                    </button>
                    <button
                      className="btn btn-primary btn-sm rounded-pill"
                      onClick={() => handleResolve(selectedReport.id)}
                      disabled={selectedReport.status === 'resolvido'}
                      title="Marcar como Resolvida"
                      style={{
                        background: 'linear-gradient(45deg, #007bff, #0056b3)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      Resolver
                    </button>
                    <button
                      className="btn btn-danger btn-sm rounded-pill"
                      onClick={() => handleDelete(selectedReport.id)}
                      title="Excluir Reporte"
                      style={{
                        background: 'linear-gradient(45deg, #dc3545, #c82333)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Selecione um reporte na lista para ver os detalhes.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Custom Modal for Info/Confirm */}
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
                <h5 className={`modal-title text-${modalType === 'confirm' ? 'warning' : 'info'} fw-bold`}>
                  {modalType === 'confirm' ? 'Confirmação' : 'Informação'}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomModal}></button>
              </div>
              <div className="modal-body pt-0">
                <p className="text-dark">{modalMessage}</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                {modalType === 'confirm' && (
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={closeCustomModal}>
                    Cancelar
                  </button>
                )}
                <button
                  type="button"
                  className={`btn rounded-pill ${modalType === 'confirm' ? 'btn-primary' : 'btn-info'}`}
                  onClick={handleModalConfirm}
                >
                  {modalType === 'confirm' ? 'Confirmar' : 'Ok'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-muted mt-5 py-3 border-top" style={{ position: 'relative', zIndex: 1 }}>
        <p>&copy; {new Date().getFullYear()} Sistema de Reportes. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default PainelAdmin;
