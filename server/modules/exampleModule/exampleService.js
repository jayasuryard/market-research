import prisma from '../../config/dbconnect.js';

/**
 * Example Service Layer
 * Handles business logic and database operations
 */

class ExampleService {
  // Get all items
  async getAll() {
    try {
      const items = await prisma.user.findMany();
      return { success: true, data: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get item by ID
  async getById(id) {
    try {
      const item = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!item) {
        return { success: false, error: 'Item not found' };
      }
      
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new item
  async create(data) {
    try {
      const item = await prisma.user.create({
        data
      });
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update item
  async update(id, data) {
    try {
      const item = await prisma.user.update({
        where: { id },
        data
      });
      return { success: true, data: item };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete item
  async delete(id) {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return { success: true, message: 'Item deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ExampleService();
