/**
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
