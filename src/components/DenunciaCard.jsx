import React from 'react';

// Componente DenunciaCard para exibir os detalhes de uma denúncia em um card
const DenunciaCard = ({ report }) => {
  // Função para formatar o timestamp
  const formatTimestamp = (timestamp) => {
    // Verifica se o timestamp é um objeto Date (como usado nos dados simulados)
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString(); // Formata para data e hora local
    }
    return 'N/A'; // Retorna N/A se não for um tipo de data reconhecido
  };

  // Determina a classe CSS do badge com base no status da denúncia
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-success';
      case 'rejeitado':
        return 'bg-danger';
      case 'resolvido':
        return 'bg-primary'; // Adicionado status "resolvido"
      case 'em análise':
        return 'bg-info text-dark';
      default:
        return 'bg-warning text-dark'; // Status padrão (Pendente)
    }
  };

  return (
    // Card com estilo moderno e transparência
    <div className="card h-100 rounded-lg border-0" style={{
      background: 'rgba(255, 255, 255, 0.85)', // Fundo branco com 85% de opacidade
      backdropFilter: 'blur(5px)', // Efeito de desfoque no fundo para um visual "glassmorphism"
      WebkitBackdropFilter: 'blur(5px)', // Compatibilidade com navegadores Webkit
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Sombra sutil para profundidade
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Transição suave
      // Efeito hover para um toque interativo
      '--bs-card-border-radius': '0.75rem', // Bootstrap 5 custom property for rounded corners
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 12px 48px 0 rgba(31, 38, 135, 0.5)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
    }}
    >
      <div className="card-body d-flex flex-column">
        {/* Exibe a imagem da denúncia se disponível */}
        {report.imageUrl && (
          <div className="mb-3 text-center">
            <img
              src={report.imageUrl}
              alt="Foto da Denúncia"
              className="img-fluid rounded"
              style={{ maxHeight: '200px', objectFit: 'cover', width: '100%', borderRadius: '0.5rem' }} // Bordas arredondadas na imagem
              // Fallback para imagem não disponível
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/cccccc/333333?text=Imagem+N%C3%A3o+Dispon%C3%ADvel"; }}
            />
          </div>
        )}
        {/* Título do card com o tipo do problema */}
        <h5 className="card-title text-dark mb-2">{report.type || 'Tipo Não Informado'}</h5>
        {/* Descrição da denúncia, truncada se for muito longa */}
        <p className="card-text text-muted small mb-1">
          <strong>Descrição:</strong> {report.description ? report.description.substring(0, 70) + (report.description.length > 70 ? '...' : '') : 'N/A'}
        </p>
        {/* Localização da denúncia */}
        <p className="card-text text-muted small mb-1">
          <strong>Localização:</strong> {report.location ? `${report.location.street}, ${report.location.neighborhood}` : 'N/A'}
        </p>
        {/* Código de acompanhamento */}
        <p className="card-text text-muted small mb-1">
          <strong>Código:</strong> {report.codAcompanhamento ? `${report.codAcompanhamento}` : 'N/A'}
        </p>
        {/* Data e hora da denúncia */}
        <p className="card-text text-muted small mb-1">
          <strong>Data:</strong> {formatTimestamp(report.timestamp)}
        </p>
        {/* Badge de status, posicionado na parte inferior do card */}
        <div className="mt-auto pt-2">
          <span className={`badge ${getStatusBadgeClass(report.status)}`}>
            {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'Pendente'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DenunciaCard;
