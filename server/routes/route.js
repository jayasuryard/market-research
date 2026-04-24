import express from 'express';
const router = express.Router();
import exampleController from '../modules/exampleModule/exampleController.js';

/**
 * Example Routes
 * Base path: /api/example
 */

// GET all items
router.get('/', exampleController.getAll.bind(exampleController));

// GET single item by ID
router.get('/:id', exampleController.getById.bind(exampleController));

// POST create new item
router.post('/', exampleController.create.bind(exampleController));

// PUT update item
router.put('/:id', exampleController.update.bind(exampleController));

// DELETE item
router.delete('/:id', exampleController.delete.bind(exampleController));

export default router;
