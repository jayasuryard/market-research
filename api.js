/**
 * API Client
 * Centralized API calls with standardized response handling
 */

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000
};

const RESPONSE_CODES = {
  SUCCESS_MIN: 1000,
  SUCCESS_MAX: 1099,
  CLIENT_ERROR_MIN: 2000,
  CLIENT_ERROR_MAX: 2099,
  SERVER_ERROR_MIN: 3000,
  SERVER_ERROR_MAX: 3099,
  AUTH_ERROR_MIN: 4000,
  AUTH_ERROR_MAX: 4099
};

function isSuccess(responseCode) {
  return responseCode >= RESPONSE_CODES.SUCCESS_MIN && 
         responseCode <= RESPONSE_CODES.SUCCESS_MAX;
}

function isAuthError(responseCode) {
  return responseCode >= RESPONSE_CODES.AUTH_ERROR_MIN && 
         responseCode <= RESPONSE_CODES.AUTH_ERROR_MAX;
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (response.ok) {
      return {
        success: isSuccess(data.responseCode),
        code: data.responseCode,
        message: data.responseMessage,
        data: data.responseData?.result || null
      };
    }

    return {
      success: false,
      code: data.responseCode,
      message: data.responseMessage,
      error: data.responseMessage
    };
    
  } catch (error) {
    return {
      success: false,
      code: 3000,
      message: 'Network error or server unavailable',
      error: error.message
    };
  }
}

async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

async function post(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function put(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

async function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

const exampleApi = {
  getAll: async () => {
    return await get('/example');
  },

  getById: async (id) => {
    return await get(`/example/${id}`);
  },

  create: async (userData) => {
    return await post('/example', userData);
  },

  update: async (id, userData) => {
    return await put(`/example/${id}`, userData);
  },

  delete: async (id) => {
    return await del(`/example/${id}`);
  }
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  example: exampleApi,
  isSuccess,
  isAuthError
};

export { exampleApi, isSuccess, isAuthError };
