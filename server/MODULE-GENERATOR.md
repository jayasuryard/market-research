# Module Generator CLI

Automatically generate new modules with controller, service, and routes following MVC architecture pattern.

## 📁 Module Structure

Each module follows this structure:
```
modules/
└── yourModule/
    ├── yourController.js    # HTTP request/response handling
    └── yourService.js       # Business logic & database operations

routes/
└── your-module.routes.js    # Express routes
```

## 🚀 Quick Start

### Generate a New Module

```bash
npm run generate:module
```

The CLI will ask you:
1. **Module name** (e.g., `user`, `post`, `product`)
2. **Prisma model name** (defaults to module name)

### Example

```bash
$ npm run generate:module

🚀 Module Generator

Enter module name (e.g., user, post, product): product
Enter Prisma model name (default: product): 

✅ Created directory: modules/productModule
✅ Created: productService.js
✅ Created: productController.js
✅ Created: routes/product.routes.js
✅ Updated routes/index.js

✨ Module 'product' created successfully!

📝 Next steps:
1. Add 'product' model to prisma/schema.prisma
2. Run: npx prisma migrate dev
3. Run: npx prisma generate
4. Access your API at: /api/product
```

## 📝 What Gets Generated

### 1. Service Layer (`moduleService.js`)
Handles all business logic and database operations:
- `getAll()` - Fetch all records
- `getById(id)` - Fetch single record
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `delete(id)` - Delete record

### 2. Controller Layer (`moduleController.js`)
Handles HTTP requests and responses:
- `GET /api/module` - Get all items
- `GET /api/module/:id` - Get item by ID
- `POST /api/module` - Create item
- `PUT /api/module/:id` - Update item
- `DELETE /api/module/:id` - Delete item

### 3. Routes (`module.routes.js`)
Express router with all CRUD endpoints automatically bound

### 4. Auto-Registration
Routes are automatically registered in `routes/index.js`

## 🔧 Customization

After generating a module, customize it to your needs:

### Add Validation Middleware
```javascript
// productController.js
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price required' });
  }
  next();
};

router.post('/', validateProduct, productController.create);
```

### Add Custom Business Logic
```javascript
// productService.js
async applyDiscount(productId, percentage) {
  const product = await prisma.product.findUnique({ 
    where: { id: productId } 
  });
  
  const newPrice = product.price * (1 - percentage / 100);
  
  return this.update(productId, { price: newPrice });
}
```

### Add Custom Routes
```javascript
// product.routes.js
router.post('/:id/discount', async (req, res) => {
  const { percentage } = req.body;
  const result = await productService.applyDiscount(req.params.id, percentage);
  res.json(result);
});
```

## 📋 Complete Workflow

### 1. Generate Module
```bash
npm run generate:module
```

### 2. Define Prisma Model
Edit `prisma/schema.prisma`:
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. Apply Migration
```bash
npx prisma migrate dev --name add_product
npx prisma generate
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test API
```bash
# Create product
curl -X POST http://localhost:3000/api/product \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Laptop","price":999.99}'

# Get all products
curl http://localhost:3000/api/product

# Get single product
curl http://localhost:3000/api/product/{id}

# Update product
curl -X PUT http://localhost:3000/api/product/{id} \\
  -H "Content-Type: application/json" \\
  -d '{"price":899.99}'

# Delete product
curl -X DELETE http://localhost:3000/api/product/{id}
```

## 🎨 Naming Conventions

The generator automatically handles naming conventions:

| Input | Controller | Service | Route | Model |
|-------|-----------|---------|-------|-------|
| `user` | `UserController` | `UserService` | `/api/user` | `user` |
| `blog-post` | `BlogPostController` | `BlogPostService` | `/api/blog-post` | `blogPost` |
| `product_category` | `ProductCategoryController` | `ProductCategoryService` | `/api/product-category` | `productCategory` |

## 📦 Example Module

Check out `modules/exampleModule/` for a complete working example using the User model.

### Test the Example
```bash
# Get all users
curl http://localhost:3000/api/example

# Create user
curl -X POST http://localhost:3000/api/example \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","name":"Test User"}'
```

## 🛠️ Advanced

### Manual Module Creation

If you prefer creating modules manually:

1. Create directory: `modules/yourModule/`
2. Create `yourController.js` and `yourService.js`
3. Create `routes/your-module.routes.js`
4. Register in `routes/index.js`:
   ```javascript
   const yourRoutes = require('./your-module.routes');
   router.use('/your-module', yourRoutes);
   ```

### Generator Script Location

The generator script is at: `scripts/generate-module.js`

You can modify the templates in the script to match your preferred code style.

## 🚨 Troubleshooting

**Module already exists**
```
❌ Module 'user' already exists!
```
Choose a different name or delete the existing module.

**Prisma model not found**
Make sure to:
1. Add the model to `schema.prisma`
2. Run `npx prisma migrate dev`
3. Run `npx prisma generate`

**Routes not working**
- Restart the server: `npm run dev`
- Check `routes/index.js` for proper registration
- Verify route path in browser/curl

## 📚 Resources

- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [Prisma CRUD](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
