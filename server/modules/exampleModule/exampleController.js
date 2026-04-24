import exampleService from './exampleService.js';
import ApiResponse from '../../utility/ApiResponse.js';

/**
 * Example Controller
 * Handles HTTP requests and responses
 */

class ExampleController {
  /**
   * GET /api/example
   * Fetch all items
   */
  async getAll(req, res) {
    try {
      const result = await exampleService.getAll();
      
      if (!result.success) {
        return ApiResponse(res, 'SERVER_ERROR', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * GET /api/example/:id
   * Fetch single item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await exampleService.getById(id);
      
      if (!result.success) {
        return ApiResponse(res, 'NOT_FOUND', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * POST /api/example
   * Create new item
   */
  async create(req, res) {
    try {
      // Validate required fields
      const { email } = req.body;
      if (!email) {
        return ApiResponse(res, 'VALIDATION_ERROR', null, 'Email is required');
      }

      const result = await exampleService.create(req.body);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'CREATED', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * PUT /api/example/:id
   * Update existing item
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await exampleService.update(id, req.body);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'UPDATED', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * DELETE /api/example/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await exampleService.delete(id);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'DELETED', { message: result.message });
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }
}

export default new ExampleController();
