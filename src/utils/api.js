const API_BASE_URL = '/api'

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

const fetchWithAuth = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    // Handle different response statuses
    if (res.status === 401) {
      // Redirect to login on auth failure
      window.location.href = `/login?redirect_url=${encodeURIComponent(window.location.pathname)}`;
      throw new Error('Authentication required');
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to ${options.method || 'fetch'} data`);
    }

    return res.json();
  } catch (error) {
    console.error('API Error:', {
      url,
      method: options.method,
      error: error.message
    });
    throw error;
  }
}

export const api = {
  // Projects
  getProjects: async () => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects`, {
        method: 'GET',
        cache: 'no-store'
      });
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  },

  createProject: async (data) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  },

  updateProject: async (projectId, data) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  // Stones
  getStones: async (projectId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/stones`);
    } catch (error) {
      console.error('Error in getStones:', error);
      throw error;
    }
  },

  createStone: async (projectId, data) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/stones`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error in createStone:', error);
      throw error;
    }
  },

  // Messages
  getMessages: async (stoneId) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/stones/${stoneId}/messages`);
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  },

  sendMessage: async (stoneId, content) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/stones/${stoneId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
}
