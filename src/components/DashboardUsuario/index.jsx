import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { candidatoAPI } from '../../services/api'

export const DashboardUsuario = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  const formatCpf = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setMessage({ text: '', type: '' });

    if (!file) {
      setCurriculoFile(null);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: 'Formato inválido. Envie PDF, DOC ou DOCX.', type: 'error' });
      setCurriculoFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'O arquivo deve ter no máximo 5MB.', type: 'error' });
      setCurriculoFile(null);
      return;
    }

    setCurriculoFile(file);
  };

  const handleUpload = async () => {
    if (!user?.candidato_id) {
      setMessage({ text: 'Usuário não identificado para upload.', type: 'error' });
      return;
    }

    if (!curriculoFile) {
      setMessage({ text: 'Selecione um arquivo antes de enviar.', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await candidatoAPI.uploadCurriculo(user.candidato_id, curriculoFile);

      if (response.success && response.data?.success) {
        if (response.data?.data) {
          login(response.data.data);
        }
        setMessage({ text: 'Currículo enviado com sucesso!', type: 'success' });
        setCurriculoFile(null);
        await carregarPreviewCurriculo(user.candidato_id);
      } else {
        setMessage({
          text: response.data?.message || 'Não foi possível enviar o currículo.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({ text: error.message || 'Erro ao enviar currículo.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const carregarPreviewCurriculo = async (candidatoId) => {
    if (!candidatoId) {
      return;
    }

    setLoadingPreview(true);

    try {
      const { blob, contentType } = await candidatoAPI.baixarCurriculoBlob(candidatoId);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (contentType === 'application/pdf' || blob.type === 'application/pdf') {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }
    } catch {
      setPreviewUrl('');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownloadCurriculo = async () => {
    if (!user?.candidato_id) {
      setMessage({ text: 'Usuário não identificado.', type: 'error' });
      return;
    }

    try {
      const { blob, fileName } = await candidatoAPI.baixarCurriculoBlob(user.candidato_id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'curriculo';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage({ text: error.message || 'Não foi possível baixar o currículo.', type: 'error' });
    }
  };

  useEffect(() => {
    if (user?.possuiCurriculo && user?.candidato_id) {
      carregarPreviewCurriculo(user.candidato_id);
    } else if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [user?.candidato_id, user?.possuiCurriculo]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Seção de boas-vindas */}
          <section className="welcome-section">
            <h1>Bem-vindo, {user.nome.split(' ')[0]}!</h1>
            <p className="welcome-text">Este é seu painel de controle pessoal na Teia.</p>
          </section>

          {/* Cards do dashboard */}
          <div className="dashboard-grid">
            {/* Card de Informações Pessoais */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Suas Informações</h2>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Nome:</span>
                  <span className="info-value">{user.nome}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">CPF:</span>
                  <span className="info-value">{formatCpf(user.cpf)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{user.candidato_id}</span>
                </div>
                <div className="info-row" style={{ display: 'block', marginTop: '12px' }}>
                  <span className="info-label" style={{ display: 'block', marginBottom: '8px' }}>
                    Currículo:
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || !curriculoFile}
                    className="login-button"
                    style={{ marginTop: '8px', maxWidth: '220px' }}
                  >
                    {uploading ? 'Enviando...' : 'Enviar currículo'}
                  </button>
                  {user?.possuiCurriculo && (
                    <button
                      type="button"
                      onClick={handleDownloadCurriculo}
                      className="login-button"
                      style={{ marginTop: '8px', maxWidth: '220px', marginLeft: '8px' }}
                    >
                      Baixar currículo
                    </button>
                  )}
                  {user?.possuiCurriculo && user?.curriculoNomeArquivo && (
                    <p className="cv-info">Arquivo atual: {user.curriculoNomeArquivo}</p>
                  )}
                  {loadingPreview && <p className="cv-info">Carregando visualização...</p>}
                  {previewUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <p className="cv-info">Visualização do PDF:</p>
                      <iframe
                        src={previewUrl}
                        title="Visualizador de currículo"
                        style={{ width: '100%', height: '420px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {message.text && <p className={`cv-info ${message.type}`}>{message.text}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Botão de logout */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={handleLogout}
              className="login-button"
              style={{ maxWidth: '200px' }}
            >
              Sair
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 Teia - Inovando por um futuro brilhante!</p>
      </footer>
    </>
  );
};
