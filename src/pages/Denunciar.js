import React, { useState, useEffect } from 'react';
import { addReport } from '../data/initialSimualtedReports';

// Componente da página de Nova Denúncia
const Denunciar = ({ navigate }) => {
    const [reportType, setReportType] = useState('');
    const [description, setDescription] = useState('');
    const [street, setStreet] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [cep, setCep] = useState('');
    const [number, setNumber] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false); // Simulação do CAPTCHA
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); // 'success' ou 'error'

    // Simulação de controle de frequência de denúncias por IP (usando localStorage para fins de protótipo)
    const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

    useEffect(() => {
        // Carrega o último tempo de submissão do localStorage
        const storedTime = localStorage.getItem('lastSubmissionTime');
        if (storedTime) {
            setLastSubmissionTime(parseInt(storedTime, 10));
        }
    }, []);

    // Manipula o upload da imagem e pré-visualização
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreviewUrl(null);
        }
    };

    // Simulação da verificação do CAPTCHA (sempre true para o protótipo)
    const verifyCaptcha = () => {
        setIsCaptchaVerified(true);
        // Em uma implementação real, aqui estaria a lógica de integração com o Google reCAPTCHA
        // Por exemplo: grecaptcha.ready(function() { grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'}).then(function(token) { ... }); });
    };

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

    // Manipula o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validação básica dos campos
        if (!reportType || !description || !street || !neighborhood || !cep || !number || !imageFile) {
            showCustomModal('Por favor, preencha todos os campos e faça o upload de uma foto.', 'error');
            setLoading(false);
            return;
        }

        // Simulação de limitação de frequência (1 denúncia a cada 30 segundos)
        const currentTime = Date.now();
        const thirtySeconds = 30 * 1000;
        if (currentTime - lastSubmissionTime < thirtySeconds) {
            showCustomModal('Você enviou uma reporte recentemente. Por favor, aguarde antes de enviar outra.', 'error');
            setLoading(false);
            return;
        }

        if (!isCaptchaVerified) {
            showCustomModal('Por favor, verifique o CAPTCHA.', 'error');
            setLoading(false);
            return;
        }

        // Cria um objeto de denúncia com um ID único e status inicial
        const newReport = {
            id: Date.now().toString(), // ID único baseado no timestamp
            type: reportType,
            description: description,
            location: { street, neighborhood, cep, number },
            imageUrl: imagePreviewUrl, // Usar a URL de pré-visualização como URL da imagem
            status: 'pendente', // Status inicial da denúncia
            timestamp: new Date(), // Data e hora atuais
        };

        try {
            // Adiciona a nova denúncia ao array centralizado
            addReport(newReport);

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula atraso da API

            // Atualiza o último tempo de submissão
            localStorage.setItem('lastSubmissionTime', currentTime.toString());
            setLastSubmissionTime(currentTime);

            showCustomModal('Seu reporte foi enviado. Código para acompanhamento:'+newReport.codAcompanhamento, 'success');

            // Limpa o formulário após o envio bem-sucedido
            setReportType('');
            setDescription('');
            setStreet('');
            setNeighborhood('');
            setCep('');
            setNumber('');
            setImageFile(null);
            setImagePreviewUrl(null);
            setIsCaptchaVerified(false); // Resetar CAPTCHA
        } catch (error) {
            console.error("Erro ao enviar reporte:", error);
            showCustomModal('Ocorreu um erro ao enviar sua reporte. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

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

            {/* Balão de Anúncio Anônimo */}
            <div className="d-none d-lg-block" style={{ // Visível apenas em telas grandes (lg e acima)
                position: 'fixed', // Alterado de 'absolute' para 'fixed'
                left: '100px',
                top: '21%',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(170deg, rgba(233, 120, 116, 0.56) 5%, rgba(255, 255, 255, 0.9) 70%)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                borderRadius: '1.5rem', // Bordas mais arredondadas
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                maxWidth: '250px',
                textAlign: 'center',
                zIndex: 2,
                border: '0px solid rgba(255, 255, 255, 0.3)',
            }}>
                <p className="lead text-dark mb-0 fw-bold">
                    Lembre-se, a sua reporte é totalmente anônima!
                </p>
            </div>

            <header className="text-center mb-5 p-4 rounded-5 shadow-lg mx-auto" style={{
                // Novo gradiente sutil para o cabeçalho, mais visível e mantendo o estilo iOS
                background: 'linear-gradient(135deg, rgba(200, 230, 255, 0.38) 0%, rgba(255, 255, 255, 0.9) 100%)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                maxWidth: '800px', // Mesma largura máxima do formulário
                width: '100%', // Garante que ocupe a largura total disponível até o maxWidth
            }}>

                <h1 className="display-4 text-dark mb-3">Fazer Novo Reporte</h1>
                <p className="lead text-muted">Preencha os campos abaixo para nos ajudar a identificar o problema.</p>
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
            </header>

            <main className="d-flex justify-content-center align-items-center" style={{ position: 'relative', zIndex: 1 }}>
                <div className="card p-4 p-md-5 rounded-5 shadow-lg" style={{
                    background: 'linear-gradient(135deg, rgba(200, 230, 255, 0.38) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: '800px',
                    width: '100%'
                }}>
                    <h2 className="h4 text-dark mb-4 text-center">Formulário de Reporte</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Tipo do Problema */}
                        <div className="mb-3">
                            <label htmlFor="reportType" className="form-label text-dark">Tipo do Problema</label>
                            <select
                                className="form-select rounded-pill"
                                id="reportType"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                required
                                style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="Buraco na Rua">Buraco na Rua</option>
                                <option value="Iluminação Pública">Iluminação Pública</option>
                                <option value="Acúmulo de Lixo">Acúmulo de Lixo</option>
                                <option value="Vazamento de Água">Vazamento de Água</option>
                                <option value="Árvore Caída">Árvore Caída</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        {/* Descrição */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label text-dark">Descrição</label>
                            <textarea
                                className="form-control rounded-lg"
                                id="description"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Descreva o problema em detalhes..."
                                style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                            ></textarea>
                        </div>

                        {/* Localização */}
                        <h5 className="h6 text-dark mb-3 mt-4">Localização</h5>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label htmlFor="street" className="form-label text-dark">Rua</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="street"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    required
                                    placeholder="Nome da Rua"
                                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="neighborhood" className="form-label text-dark">Bairro</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="neighborhood"
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    required
                                    placeholder="Nome do Bairro"
                                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="cep" className="form-label text-dark">CEP</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="cep"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    required
                                    placeholder="Ex: 12345-678"
                                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="number" className="form-label text-dark">Número</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    required
                                    placeholder="Número ou S/N"
                                    style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        </div>

                        {/* Upload de Foto */}
                        <div className="mb-3">
                            <label htmlFor="imageUpload" className="form-label text-dark">Upload de Foto</label>
                            <input
                                type="file"
                                className="form-control rounded-pill"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                required
                                style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(0,0,0,0.1)' }}
                            />
                            {imagePreviewUrl && (
                                <div className="mt-3 text-center">
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Pré-visualização da imagem"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.75rem' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* CAPTCHA Placeholder */}
                        <div className="mb-4 p-3 rounded-lg border" style={{ background: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(0,0,0,0.1)' }}>
                            <p className="text-muted small mb-2">
                                <i className="bi bi-robot me-2"></i>
                                Placeholder para Google reCAPTCHA v2/v3
                            </p>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm rounded-pill"
                                onClick={verifyCaptcha}
                                disabled={isCaptchaVerified}
                            >
                                {isCaptchaVerified ? 'CAPTCHA Verificado!' : 'Verificar CAPTCHA (Simulado)'}
                            </button>
                        </div>

                        {/* Botão Enviar */}
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-pill shadow-lg animate-button"
                                disabled={loading || !isCaptchaVerified}
                                style={{
                                    background: 'linear-gradient(45deg, #28a745, #218838)', // Gradiente verde para enviar
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 6px 15px rgba(40, 167, 69, 0.4)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(40, 167, 69, 0.4)';
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Reporte'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

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

            <footer className="text-center text-muted mt-5 py-3 border-top" style={{ position: 'relative', zIndex: 1 }}>
                <p>&copy; {new Date().getFullYear()} Sistema de Reportes. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Denunciar;
