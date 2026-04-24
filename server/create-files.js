const fs = require('fs');

// Constants file
const constantsJS = `/**
 * Global Constants
 * Centralized constants for the entire application
 */

// Application States
const STATE = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
  ARCHIVED: 'ARCHIVED',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// Response Code Ranges
const RESPONSE_CODES = {
  // Success Codes (1000-1099)
  SUCCESS: 1000,
  CREATED: 1001,
  UPDATED: 1002,
  DELETED: 1003,
  NO_CONTENT: 1004,
  FETCHED: 1005,

  // Client Error Codes (2000-2099)
  BAD_REQUEST: 2000,
  VALIDATION_ERROR: 2001,
  MISSING_FIELDS: 2002,
  INVALID_FORMAT: 2003,
  DUPLICATE_ENTRY: 2004,
  NOT_FOUND: 2005,
  ALREADY_EXISTS: 2006,
  INVALID_CREDENTIALS: 2007,
  EXPIRED: 2008,

  // Server Error Codes (3000-3099)
  SERVER_ERROR: 3000,
  DATABASE_ERROR: 3001,
  SERVICE_UNAVAILABLE: 3002,
  TIMEOUT: 3003,
  CONFIGURATION_ERROR: 3004,

  // Authentication/Authorization Codes (4000-4099)
  UNAUTHORIZED: 4000,
  INVALID_TOKEN: 4001,
  TOKEN_EXPIRED: 4002,
  FORBIDDEN: 4003,
  ACCESS_DENIED: 4004,

  // External Service Codes (5000-5099)
  EXTERNAL_API_ERROR: 5000,
  PAYMENT_FAILED: 5001,
  EMAIL_FAILED: 5002,
  SMS_FAILED: 5003
};

// HTTP Status Code Mapping
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Pagination Defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Date Formats
const DATE_FORMAT = {
  DEFAULT: 'YYYY-MM-DD',
  WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIMESTAMP: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// User Roles
const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  GUEST: 'GUEST'
};

// Sort Orders
const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
};

// Environment Types
const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
  STAGING: 'staging'
};

module.exports = {
  STATE,
  RESPONSE_CODES,
  HTTP_STATUS,
  PAGINATION,
  DATE_FORMAT,
  USER_ROLES,
  SORT_ORDER,
  ENVIRONMENT
};
`;

// Response file
const responseJS = `/**
 * Response Messages
 * Standardized response messages mapped to response codes
 */

const { RESPONSE_CODES } = require('./constant');

const RESPONSE_MESSAGES = {
  // Success Messages (1000-1099)
  [RESPONSE_CODES.SUCCESS]: 'Success',
  [RESPONSE_CODES.CREATED]: 'Created successfully',
  [RESPONSE_CODES.UPDATED]: 'Updated successfully',
  [RESPONSE_CODES.DELETED]: 'Deleted successfully',
  [RESPONSE_CODES.NO_CONTENT]: 'No content',
  [RESPONSE_CODES.FETCHED]: 'Data fetched successfully',

  // Client Error Messages (2000-2099)
  [RESPONSE_CODES.BAD_REQUEST]: 'Bad request',
  [RESPONSE_CODES.VALIDATION_ERROR]: 'Validation error',
  [RESPONSE_CODES.MISSING_FIELDS]: 'Missing required fields',
  [RESPONSE_CODES.INVALID_FORMAT]: 'Invalid format',
  [RESPONSE_CODES.DUPLICATE_ENTRY]: 'Duplicate entry',
  [RESPONSE_CODES.NOT_FOUND]: 'Resource not found',
  [RESPONSE_CODES.ALREADY_EXISTS]: 'Resource already exists',
  [RESPONSE_CODES.INVALID_CREDENTIALS]: 'Invalid credentials',
  [RESPONSE_CODES.EXPIRED]: 'Resource has expired',

  // Server Error Messages (3000-3099)
  [RESPONSE_CODES.SERVER_ERROR]: 'Internal server error',
  [RESPONSE_CODES.DATABASE_ERROR]: 'Database error',
  [RESPONSE_CODES.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [RESPONSE_CODES.TIMEOUT]: 'Request timeout',
  [RESPONSE_CODES.CONFIGURATION_ERROR]: 'Configuration error',

  // Authentication/Authorization Messages (4000-4099)
  [RESPONSE_CODES.UNAUTHORIZED]: 'Unauthorized access',
  [RESPONSE_CODES.INVALID_TOKEN]: 'Invalid token',
  [RESPONSE_CODES.TOKEN_EXPIRED]: 'Token expired',
  [RESPONSE_CODES.FORBIDDEN]: 'Forbidden',
  [RESPONSE_CODES.ACCESS_DENIED]: 'Access denied',

  // External Service Messages (5000-5099)
  [RESPONSE_CODES.EXTERNAL_API_ERROR]: 'External API error',
  [RESPONSE_CODES.PAYMENT_FAILED]: 'Payment failed',
  [RESPONSE_CODES.EMAIL_FAILED]: 'Email delivery failed',
  [RESPONSE_CODES.SMS_FAILED]: 'SMS delivery failed'
};

// Response type to code mapping (for easier usage)
const RESPONSE_TYPES = {
  SUCCESS: RESPONSE_CODES.SUCCESS,
  CREATED: RESPONSE_CODES.CREATED,
  UPDATED: RESPONSE_CODES.UPDATED,
  DELETED: RESPONSE_CODES.DELETED,
  FETCHED: RESPONSE_CODES.FETCHED,
  
  BAD_REQUEST: RESPONSE_CODES.BAD_REQUEST,
  VALIDATION_ERROR: RESPONSE_CODES.VALIDATION_ERROR,
  NOT_FOUND: RESPONSE_CODES.NOT_FOUND,
  DUPLICATE: RESPONSE_CODES.DUPLICATE_ENTRY,
  
  SERVER_ERROR: RESPONSE_CODES.SERVER_ERROR,
  DATABASE_ERROR: RESPONSE_CODES.DATABASE_ERROR,
  
  UNAUTHORIZED: RESPONSE_CODES.UNAUTHORIZED,
  FORBIDDEN: RESPONSE_CODES.FORBIDDEN
};

module.exports = {
  RESPONSE_MESSAGES,
  RESPONSE_TYPES
};
`;

// ApiResponse file
const apiResponseJS = `/**
 * ApiResponse Utility
 * Standardized API response formatter
 */

const { RESPONSE_CODES, HTTP_STATUS } = require('../gobals/constant');
const { RESPONSE_MESSAGES, RESPONSE_TYPES } = require('../gobals/response');

function getHttpStatus(responseCode) {
  if (responseCode >= 1000 && responseCode < 1100) {
    if (responseCode === RESPONSE_CODES.CREATED) return HTTP_STATUS.CREATED;
    if (responseCode === RESPONSE_CODES.NO_CONTENT) return HTTP_STATUS.NO_CONTENT;
    return HTTP_STATUS.OK;
  }
  
  if (responseCode >= 2000 && responseCode < 2100) {
    if (responseCode === RESPONSE_CODES.NOT_FOUND) return HTTP_STATUS.NOT_FOUND;
    if (responseCode === RESPONSE_CODES.DUPLICATE_ENTRY) return HTTP_STATUS.CONFLICT;
    return HTTP_STATUS.BAD_REQUEST;
  }
  
  if (responseCode >= 3000 && responseCode < 3100) {
    if (responseCode === RESPONSE_CODES.SERVICE_UNAVAILABLE) return HTTP_STATUS.SERVICE_UNAVAILABLE;
    return HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
  
  if (responseCode >= 4000 && responseCode < 4100) {
    if (responseCode === RESPONSE_CODES.UNAUTHORIZED) return HTTP_STATUS.UNAUTHORIZED;
    if (responseCode === RESPONSE_CODES.FORBIDDEN) return HTTP_STATUS.FORBIDDEN;
    return HTTP_STATUS.UNAUTHORIZED;
  }
  
  if (responseCode >= 5000 && responseCode < 5100) {
    return HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
  
  return HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

function ApiResponse(res, type, data = null, customMessage = null, customCode = null) {
  let responseCode;
  let responseMessage;
  
  if (type === 'CUSTOM') {
    responseCode = customCode || RESPONSE_CODES.SUCCESS;
    responseMessage = customMessage || RESPONSE_MESSAGES[responseCode] || 'Success';
  } else {
    responseCode = RESPONSE_TYPES[type] || RESPONSE_CODES.SERVER_ERROR;
    responseMessage = customMessage || RESPONSE_MESSAGES[responseCode] || 'Unknown response';
  }
  
  const httpStatus = getHttpStatus(responseCode);
  
  const response = {
    responseCode,
    responseMessage,
    responseData: {
      result: data
    }
  };
  
  return res.status(httpStatus).json(response);
}

function serializeData(data, excludeFields = ['password', 'token', 'secret']) {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item, excludeFields));
  }
  
  if (typeof data === 'object' && data !== null) {
    const serialized = { ...data };
    
    excludeFields.forEach(field => {
      delete serialized[field];
    });
    
    Object.keys(serialized).forEach(key => {
      if (typeof serialized[key] === 'object' && serialized[key] !== null) {
        serialized[key] = serializeData(serialized[key], excludeFields);
      }
    });
    
    return serialized;
  }
  
  return data;
}

ApiResponse.success = (res, data, message = null) => {
  return ApiResponse(res, 'SUCCESS', data, message);
};

ApiResponse.created = (res, data, message = null) => {
  return ApiResponse(res, 'CREATED', data, message);
};

ApiResponse.error = (res, type = 'SERVER_ERROR', message = null) => {
  return ApiResponse(res, type, null, message);
};

ApiResponse.notFound = (res, message = null) => {
  return ApiResponse(res, 'NOT_FOUND', null, message);
};

ApiResponse.validationError = (res, errors, message = null) => {
  return ApiResponse(res, 'VALIDATION_ERROR', { errors }, message);
};

module.exports = ApiResponse;
module.exports.serializeData = serializeData;
`;

// api.js for frontend
const apiJS = `/**
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
  const url = \`\${API_CONFIG.baseURL}\${endpoint}\`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = \`Bearer \${token}\`;
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
    return await get(\`/example/\${id}\`);
  },

  create: async (userData) => {
    return await post('/example', userData);
  },

  update: async (id, userData) => {
    return await put(\`/example/\${id}\`, userData);
  },

  delete: async (id) => {
    return await del(\`/example/\${id}\`);
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
`;

// Write files
try {
  fs.writeFileSync('gobals/constant.js', constantsJS);
  console.log('✅ Created gobals/constant.js');
  
  fs.writeFileSync('gobals/response.js', responseJS);
  console.log('✅ Created gobals/response.js');
  
  fs.writeFileSync('utility/ApiResponse.js', apiResponseJS);
  console.log('✅ Created utility/ApiResponse.js');
  
  fs.writeFileSync('../api.js', apiJS);
  console.log('✅ Created api.js');
  
  console.log('\n🎉 All files created successfully!');
} catch (error) {
  console.error('Error creating files:', error.message);
}
