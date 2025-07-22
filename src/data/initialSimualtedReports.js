// src/data/initialSimualtedReports.js

let initialSimulatedReports = [
  {
    id: '1',
    type: 'Buraco na Rua',
    description: 'Grande buraco na Rua das Flores, próximo ao número 123. Cuidado ao passar de carro.',
    location: { street: 'Rua das Flores', neighborhood: 'Centro', cep: '12345-678', number: '123' },
    imageUrl: 'https://placehold.co/400x200/FF5733/FFFFFF?text=Buraco+na+Rua',
    status: 'pendente',
    timestamp: new Date(Date.now() - 86400000 * 2), // 2 dias atrás
    codAcompanhamento: 'A12345', // Código de acompanhamento fictício
  },
  {
    id: '2',
    type: 'Iluminação Pública',
    description: 'Poste de luz queimado na Avenida Principal, altura do 456. A rua está muito escura à noite.',
    location: { street: 'Avenida Principal', neighborhood: 'Bairro Novo', cep: '98765-432', number: '456' },
    imageUrl: 'https://placehold.co/400x200/3366FF/FFFFFF?text=Poste+Queimado',
    status: 'em análise',
    timestamp: new Date(Date.now() - 86400000 * 1),
    codAcompanhamento:'A123456',
  },
  {
    id: '3',
    type: 'Acúmulo de Lixo',
    description: 'Muito lixo acumulado na esquina da Rua da Paz com a Rua da Esperança. Precisa de coleta urgente.',
    location: { street: 'Rua da Paz', neighborhood: 'Vila Antiga', cep: '11223-344', number: 'S/N' },
    imageUrl: 'https://placehold.co/400x200/66BB6A/FFFFFF?text=Lixo+Acumulado',
    status: 'resolvido',
    timestamp: new Date(Date.now() - 86400000 * 3), // 3 dias atrás,
    codAcompanhamento:'A1234567',
  },
  {
    id: '4',
    type: 'Vazamento de Água',
    description: 'Vazamento de água na calçada da Rua do Sol, em frente ao mercado. Grande desperdício.',
    location: { street: 'Rua do Sol', neighborhood: 'Jardim Alegre', cep: '55443-321', number: '789' },
    imageUrl: 'https://placehold.co/400x200/FFC300/333333?text=Vazamento+%C3%81gua',
    status: 'pendente',
    timestamp: new Date(Date.now() - 86400000 * 0.5), // Meio dia atrás
    codAcompanhamento:'A1234568',
  },
  {
    id: '5',
    type: 'Árvore Caída',
    description: 'Árvore de pequeno porte caída sobre a calçada na Praça Central. Obstruindo a passagem.',
    location: { street: 'Praça Central', neighborhood: 'Centro', cep: '00000-000', number: 'S/N' },
    imageUrl: 'https://placehold.co/400x200/8D6E63/FFFFFF?text=%C3%81rvore+Ca%C3%ADda',
    status: 'em análise',
    timestamp: new Date(Date.now() - 86400000 * 1.5), // 1.5 dias atrás
    codAcompanhamento:'A12345678',
  },
];

export default initialSimulatedReports;

function generateCodAcompanhamento() {
  const timestamp = Date.now().toString(36); // Converte o timestamp para base 36
  const randomString = Math.random().toString(36).substring(2, 9); // Gera uma string aleatória
  return `report-${timestamp}-${randomString}`; // Combina para formar um ID único
}

/**
 * Retorna uma cópia das denúncias atuais, ordenadas pela data mais recente.
 * @returns {Array} Uma cópia do array de denúncias.
 */
export const getReports = () => {
  return [...initialSimulatedReports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

/**
 * Adiciona uma nova denúncia ao array.
 * @param {Object} newReport - O objeto da nova denúncia a ser adicionada.
 */
export const addReport = (newReport) => {
  newReport.codAcompanhamento = generateCodAcompanhamento()
  initialSimulatedReports.push(newReport);

  console.log("Denúncia adicionada:", newReport);
  console.log("Denúncias atuais após adição:", initialSimulatedReports);
};

/**
 * Atualiza o status de uma denúncia existente.
 * @param {string} reportId - O ID da denúncia a ser atualizada.
 * @param {Object} updates - Um objeto contendo as propriedades a serem atualizadas.
 */
export const updateReport = (reportId, updates) => {
  initialSimulatedReports = initialSimulatedReports.map(report =>
    report.id === reportId ? { ...report, ...updates } : report
  );
  console.log("Denúncia atualizada:", reportId, updates);
  console.log("Denúncias atuais após atualização:", initialSimulatedReports);
};

/**
 * Exclui uma denúncia do array.
 * @param {string} reportId - O ID da denúncia a ser excluída.
 */
export const deleteReport = (reportId) => {
  initialSimulatedReports = initialSimulatedReports.filter(report => report.id !== reportId);
  console.log("Denúncia excluída:", reportId);
  console.log("Denúncias atuais após exclusão:", initialSimulatedReports);
};

/**
 * Busca uma denúncia pelo seu código de acompanhamento.
 * @param {string} trackingCode - O código de acompanhamento da denúncia.
 * @returns {Object|undefined} A denúncia encontrada ou undefined se não for encontrada.
 */
export const getReportByTrackingCode = (trackingCode) => {
  return initialSimulatedReports.find(report => report.codAcompanhamento === trackingCode);
};