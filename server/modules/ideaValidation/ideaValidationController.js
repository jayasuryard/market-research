import ideaValidationService from './ideaValidationService.js';
import ApiResponse from '../../utility/ApiResponse.js';

/**
 * Idea Validation Controller
 * Handles HTTP requests for market validation
 */

class IdeaValidationController {
  /**
   * POST /api/validation/submit
   * Submit a new idea for validation
   */
  async submitIdea(req, res) {
    try {
      const { ideaDescription, targetAudience, geography, pricingAssumption, stage } = req.body;
      
      // Validate required fields
      if (!ideaDescription || ideaDescription.trim() === '') {
        return ApiResponse(res, 'VALIDATION_ERROR', null, 'Idea description is required');
      }
      
      if (!stage || !['idea', 'mvp', 'live'].includes(stage)) {
        return ApiResponse(res, 'VALIDATION_ERROR', null, 'Stage must be: idea, mvp, or live');
      }
      
      // Create submission
      const result = await ideaValidationService.submitIdea({
        ideaDescription,
        targetAudience,
        geography,
        pricingAssumption,
        stage,
        userId: req.user?.id || 'guest' // Assuming auth middleware sets req.user
      });
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'CREATED', result.data);
    } catch (error) {
      console.error('Submit idea error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * POST /api/validation/:id/clarify
   * Answer clarification questions
   */
  async provideClarification(req, res) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      
      if (!answers || !Array.isArray(answers)) {
        return ApiResponse(res, 'VALIDATION_ERROR', null, 'Answers array is required');
      }
      
      const result = await ideaValidationService.provideClarification(id, answers);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      console.error('Clarification error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * POST /api/validation/:id/analyze
   * Start the analysis process
   */
  async startAnalysis(req, res) {
    try {
      const { id } = req.params;
      
      const result = await ideaValidationService.startAnalysis(id);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      console.error('Start analysis error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * GET /api/validation/:id/status
   * Check analysis status
   */
  async getStatus(req, res) {
    try {
      const { id } = req.params;
      
      const result = await ideaValidationService.getStatus(id);
      
      if (!result.success) {
        return ApiResponse(res, 'NOT_FOUND', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      console.error('Get status error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * GET /api/validation/:id/report
   * Get the final validation report
   */
  async getReport(req, res) {
    try {
      const { id } = req.params;
      
      const result = await ideaValidationService.getReport(id);
      
      if (!result.success) {
        return ApiResponse(res, 'NOT_FOUND', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      console.error('Get report error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * GET /api/validation/user/:userId
   * Get all submissions for a user
   */
  async getUserSubmissions(req, res) {
    try {
      const { userId } = req.params;
      
      const result = await ideaValidationService.getUserSubmissions(userId);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      console.error('Get user submissions error:', error);
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }
}

export default new IdeaValidationController();
