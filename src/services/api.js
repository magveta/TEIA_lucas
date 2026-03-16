// services/api.js
// Serviço centralizado para comunicação com o backend Spring Boot

const API_BASE_URL = 'http://localhost:8080';

/**
 * Função auxiliar para fazer requisições HTTP
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');

    // Verificar se a resposta é JSON
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    }

    // Se não for JSON, retornar informação básica
    return {
      success: response.ok,
      data: null,
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
  }
};

/**
 * API de Candidatos
 */
export const candidatoAPI = {
  /**
   * Listar todos os candidatos
   */
  getAll: async () => {
    return await fetchAPI('/candidato', {
      method: 'GET',
    });
  },

  /**
   * Cadastrar novo candidato
   */
  cadastrar: async (candidatoData) => {
    return await fetchAPI('/candidato', {
      method: 'POST',
      body: JSON.stringify(candidatoData),
    });
  },

  /**
   * Fazer login
   */
  login: async (credentials) => {
    return await fetchAPI('/candidato/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Upload de currículo do candidato
   */
  uploadCurriculo: async (candidatoId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/candidato/${candidatoId}/curriculo`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('Erro no upload de currículo:', error);
      throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  },

  /**
   * Baixar currículo do candidato como Blob
   */
  baixarCurriculoBlob: async (candidatoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidato/${candidatoId}/curriculo`, {
        method: 'GET',
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData?.message || 'Não foi possível baixar o currículo.');
        }
        throw new Error('Não foi possível baixar o currículo.');
      }

      const blob = await response.blob();
      const contentType = response.headers.get('content-type') || blob.type;
      const disposition = response.headers.get('content-disposition') || '';

      let fileName = 'curriculo';
      const match = disposition.match(/filename="?([^\"]+)"?/i);
      if (match && match[1]) {
        fileName = match[1];
      }

      return { blob, contentType, fileName };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
  },
};

/**
 * Funções auxiliares de autenticação
 */
export const auth = {
  /**
   * Salvar usuário no localStorage
   */
  saveUser: (userData) => {
    localStorage.setItem('teiaUser', JSON.stringify(userData));
  },

  /**
   * Obter usuário do localStorage
   */
  getUser: () => {
    const userData = localStorage.getItem('teiaUser');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated: () => {
    return localStorage.getItem('teiaUser') !== null;
  },

  /**
   * Fazer logout
   */
  logout: () => {
    localStorage.removeItem('teiaUser');
  },
};

export default candidatoAPI;
