// API client for handling backend requests
const API_BASE_URL = '/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const handleResponse = async (response) => {
  console.log('📡 API Response:', {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || error.error || error.details || 'Request failed';
      } else {
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        errorMessage = response.status === 401 
          ? 'Please sign in to continue'
          : `Request failed with status ${response.status}`;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
      errorMessage = response.status === 401 
        ? 'Authentication failed'
        : `Request failed with status ${response.status}`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  return response.json();
};

const fetchWithAuth = async (url, options = {}) => {
  try {
    // We don't need to manually get the token since Clerk middleware handles this
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', {
      url,
      method: options.method,
      error: error.message
    });
    throw error;
  }
};

export const api = {
  // Project endpoints
  projects: {
    getAll: async () => {
      console.log('📡 Fetching all projects');
      return fetchWithAuth(`${API_BASE_URL}/projects`);
    },
    
    getById: async (id) => {
      console.log('📡 Fetching project:', id);
      return fetchWithAuth(`${API_BASE_URL}/projects/${id}`);
    },
    
    create: async (projectData) => {
      console.log('📡 Creating project:', projectData);
      return fetchWithAuth(`${API_BASE_URL}/projects`, {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },
    
    update: async (id, projectData) => {
      console.log('📡 Updating project:', { id, ...projectData });
      return fetchWithAuth(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
    },
    
    delete: async (id) => {
      console.log('📡 Deleting project:', id);
      return fetchWithAuth(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE'
      });
    },
  },

  // Stone endpoints
  stones: {
    getAll: async (projectId) => {
      console.log('📡 Fetching stones for project:', projectId);
      return fetchWithAuth(`${API_BASE_URL}/stones?projectId=${projectId}`);
    },
    
    create: async (stoneData) => {
      console.log('📡 Creating stone:', stoneData);
      return fetchWithAuth(`${API_BASE_URL}/stones`, {
        method: 'POST',
        body: JSON.stringify(stoneData),
      });
    },
    
    update: async (id, stoneData) => {
      console.log('📡 Updating stone:', { id, ...stoneData });
      return fetchWithAuth(`${API_BASE_URL}/stones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(stoneData),
      });
    },
    
    delete: async (id) => {
      console.log('📡 Deleting stone:', id);
      return fetchWithAuth(`${API_BASE_URL}/stones/${id}`, {
        method: 'DELETE'
      });
    },
  },

  // Chat endpoints
  chat: {
    getMessages: async (stoneId) => {
      console.log('📡 Fetching messages for stone:', stoneId);
      return fetchWithAuth(`${API_BASE_URL}/chat?stoneId=${stoneId}`);
    },
    
    sendMessage: async (messageData) => {
      console.log('📡 Sending message:', messageData);
      return fetchWithAuth(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
  },
};