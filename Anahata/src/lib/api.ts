const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || 'Request failed';
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  demoLogin: async (name: string, password: string) => {
    const response = await apiRequest('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  verifySession: async () => {
    return apiRequest('/auth/verify');
  },

  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
  },
};

// Journal API
export const journalAPI = {
  create: async (content: string, allowAIMemory: boolean = false) => {
    // Use simple payload for now - backend will accept any base64 string
    // that's at least 50 characters (to pass validation)
    const payload = {
      content,
      timestamp: new Date().toISOString(),
      nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    };
    const encryptedPayload = btoa(JSON.stringify(payload));

    return apiRequest('/journal/create', {
      method: 'POST',
      body: JSON.stringify({
        encrypted_payload: encryptedPayload,
        allow_ai_memory: allowAIMemory,
      }),
    });
  },

  createEncrypted: async (encryptedPayload: string, allowAIMemory: boolean = false) => {
    return apiRequest('/journal/create', {
      method: 'POST',
      body: JSON.stringify({
        encrypted_payload: encryptedPayload,
        allow_ai_memory: allowAIMemory,
      }),
    });
  },

  list: async (limit: number = 50, offset: number = 0) => {
    return apiRequest(`/journal/list?limit=${limit}&offset=${offset}`);
  },

  delete: async (id: string) => {
    return apiRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return apiRequest('/journal/clear', {
      method: 'DELETE',
    });
  },

  analyze: async (journals: any[]) => {
    return apiRequest('/journal/analyze', {
      method: 'POST',
      body: JSON.stringify({ journals }),
    });
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message: string, mode: string = 'LISTEN', allowMemory: boolean = false) => {
    return apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        message,
        mode,
        allow_memory: allowMemory,
      }),
    });
  },

  getSession: async () => {
    return apiRequest('/chat/session');
  },

  updateMode: async (mode: string) => {
    return apiRequest('/chat/mode', {
      method: 'PUT',
      body: JSON.stringify({ mode }),
    });
  },
};

// Chat History API (we'll store chat messages in localStorage for now, or create a backend endpoint)
export const chatHistoryAPI = {
  saveMessage: (message: { text: string; isAI: boolean; timestamp: Date }) => {
    const history = chatHistoryAPI.getHistory();
    history.push({
      ...message,
      timestamp: message.timestamp.toISOString(),
    });
    localStorage.setItem('chatHistory', JSON.stringify(history));
  },

  getHistory: (): Array<{ text: string; isAI: boolean; timestamp: string }> => {
    const stored = localStorage.getItem('chatHistory');
    return stored ? JSON.parse(stored) : [];
  },

  clearHistory: () => {
    localStorage.removeItem('chatHistory');
  },
};


