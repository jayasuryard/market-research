#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * CLI Module Generator
 * Automatically creates a new module with controller, service, and route
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function generateServiceTemplate(moduleName, modelName) {
  const camelModule = toCamelCase(moduleName);
  const pascalModel = toPascalCase(modelName);
  
  return `const prisma = require('../../prisma-client');

/**
 * ${toPascalCase(moduleName)} Service Layer
 * Handles business logic and database operations
 */

class ${toPascalCase(moduleName)}Service {
  // Get all items
  async getAll() {
    try {
      const items = await prisma.${camelModule}.findMany();
      return { success: true, data: items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get item by ID
  async getById(id) {
    try {
      const item = await prisma.${camelModule}.findUnique({
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
      const item = await prisma.${camelModule}.create({
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
      const item = await prisma.${camelModule}.update({
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
      await prisma.${camelModule}.delete({
        where: { id }
      });
      return { success: true, message: 'Item deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ${toPascalCase(moduleName)}Service();
`;
}

function generateControllerTemplate(moduleName) {
  const camelModule = toCamelCase(moduleName);
  const pascalModule = toPascalCase(moduleName);
  const kebabModule = toKebabCase(moduleName);
  
  return `const ${camelModule}Service = require('./${camelModule}Service');
const ApiResponse = require('../../utility/ApiResponse');

/**
 * ${pascalModule} Controller
 * Handles HTTP requests and responses
 */

class ${pascalModule}Controller {
  /**
   * GET /api/${kebabModule}
   * Fetch all items
   */
  async getAll(req, res) {
    try {
      const result = await ${camelModule}Service.getAll();
      
      if (!result.success) {
        return ApiResponse(res, 'SERVER_ERROR', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * GET /api/${kebabModule}/:id
   * Fetch single item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await ${camelModule}Service.getById(id);
      
      if (!result.success) {
        return ApiResponse(res, 'NOT_FOUND', null, result.error);
      }
      
      return ApiResponse(res, 'SUCCESS', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * POST /api/${kebabModule}
   * Create new item
   */
  async create(req, res) {
    try {
      const result = await ${camelModule}Service.create(req.body);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'CREATED', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * PUT /api/${kebabModule}/:id
   * Update existing item
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await ${camelModule}Service.update(id, req.body);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'UPDATED', result.data);
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }

  /**
   * DELETE /api/${kebabModule}/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ${camelModule}Service.delete(id);
      
      if (!result.success) {
        return ApiResponse(res, 'BAD_REQUEST', null, result.error);
      }
      
      return ApiResponse(res, 'DELETED', { message: result.message });
    } catch (error) {
      return ApiResponse(res, 'SERVER_ERROR');
    }
  }
}

module.exports = new ${pascalModule}Controller();
`;
}

function generateRouteTemplate(moduleName) {
  const camelModule = toCamelCase(moduleName);
  const pascalModule = toPascalCase(moduleName);
  const kebabModule = toKebabCase(moduleName);
  
  return `const express = require('express');
const router = express.Router();
const ${camelModule}Controller = require('../modules/${camelModule}Module/${camelModule}Controller');

/**
 * ${pascalModule} Routes
 * Base path: /api/${kebabModule}
 */

// GET all items
router.get('/', ${camelModule}Controller.getAll.bind(${camelModule}Controller));

// GET single item by ID
router.get('/:id', ${camelModule}Controller.getById.bind(${camelModule}Controller));

// POST create new item
router.post('/', ${camelModule}Controller.create.bind(${camelModule}Controller));

// PUT update item
router.put('/:id', ${camelModule}Controller.update.bind(${camelModule}Controller));

// DELETE item
router.delete('/:id', ${camelModule}Controller.delete.bind(${camelModule}Controller));

module.exports = router;
`;
}

async function generateModule() {
  console.log('🚀 Module Generator\n');
  
  const moduleName = await question('Enter module name (e.g., user, post, product): ');
  
  if (!moduleName || moduleName.trim() === '') {
    console.log('❌ Module name is required!');
    rl.close();
    return;
  }
  
  const modelName = await question(`Enter Prisma model name (default: ${moduleName}): `) || moduleName;
  
  const camelModule = toCamelCase(moduleName);
  const kebabModule = toKebabCase(moduleName);
  
  // Create module directory
  const moduleDir = path.join(__dirname, '../modules', `${camelModule}Module`);
  
  if (fs.existsSync(moduleDir)) {
    console.log(`❌ Module '${camelModule}' already exists!`);
    rl.close();
    return;
  }
  
  try {
    // Create directory
    fs.mkdirSync(moduleDir, { recursive: true });
    console.log(`✅ Created directory: modules/${camelModule}Module`);
    
    // Create service file
    const servicePath = path.join(moduleDir, `${camelModule}Service.js`);
    fs.writeFileSync(servicePath, generateServiceTemplate(moduleName, modelName));
    console.log(`✅ Created: ${camelModule}Service.js`);
    
    // Create controller file
    const controllerPath = path.join(moduleDir, `${camelModule}Controller.js`);
    fs.writeFileSync(controllerPath, generateControllerTemplate(moduleName));
    console.log(`✅ Created: ${camelModule}Controller.js`);
    
    // Create route file
    const routePath = path.join(__dirname, '../routes', `${kebabModule}.routes.js`);
    fs.writeFileSync(routePath, generateRouteTemplate(moduleName));
    console.log(`✅ Created: routes/${kebabModule}.routes.js`);
    
    // Update routes/index.js
    const routesIndexPath = path.join(__dirname, '../routes/index.js');
    let routesIndex = fs.readFileSync(routesIndexPath, 'utf8');
    
    // Add import
    const importLine = `const ${camelModule}Routes = require('./${kebabModule}.routes');`;
    const importRegex = /\/\/ Import route modules/;
    routesIndex = routesIndex.replace(importRegex, `// Import route modules\n${importLine}`);
    
    // Add route registration
    const routeLine = `router.use('/${kebabModule}', ${camelModule}Routes);`;
    const registerRegex = /\/\/ Register routes/;
    routesIndex = routesIndex.replace(registerRegex, `// Register routes\n${routeLine}`);
    
    fs.writeFileSync(routesIndexPath, routesIndex);
    console.log(`✅ Updated routes/index.js`);
    
    console.log(`\n✨ Module '${camelModule}' created successfully!\n`);
    console.log('📝 Next steps:');
    console.log(`1. Add '${modelName}' model to prisma/schema.prisma`);
    console.log('2. Run: npx prisma migrate dev');
    console.log('3. Run: npx prisma generate');
    console.log(`4. Access your API at: /api/${kebabModule}\n`);
    
  } catch (error) {
    console.error('❌ Error generating module:', error.message);
  }
  
  rl.close();
}

generateModule();
