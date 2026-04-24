/**
 * ApiResponse Utility
 * Standardized API response formatter
 */

import { RESPONSE_CODES, HTTP_STATUS } from '../gobals/constant.js';
import { RESPONSE_MESSAGES, RESPONSE_TYPES } from '../gobals/response.js';

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

export default ApiResponse;
export { serializeData };
