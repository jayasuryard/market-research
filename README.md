# Fullstack Template

A modern fullstack web application template with React + Vite frontend and Express + Prisma backend.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend
- **Express 5** - Node.js web framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Database (configurable)
- **Morgan** - HTTP request logger
- **Nodemon** - Auto-restart on changes

## 📁 Project Structure

```
fullstack-template/
├── src/                    # React frontend source
│   ├── App.jsx
│   ├── main.jsx
│   └── assets/
├── api.js                  # Frontend API client
├── server/                 # Express backend
│   ├── modules/           # Feature modules (MVC)
│   │   └── exampleModule/
│   ├── routes/            # API routes
│   ├── gobals/            # Constants & response codes
│   ├── utility/           # Reusable utilities (ApiResponse)
│   ├── prisma/            # Database schema
│   ├── scripts/           # CLI tools (module generator)
│   ├── CODING_STANDARDS.txt    # Complete coding standards
│   ├── QUICK_REFERENCE.md      # Quick reference guide
│   └── MODULE-GENERATOR.md     # Module generator docs
├── public/                # Static assets
└── package.json           # Root package scripts
```

## ⭐ Key Features

### Standardized API Responses
All API responses follow a consistent format:
```json
{
  "responseCode": 1000,
  "responseMessage": "Success",
  "responseData": {
    "result": {
      // Your data here
    }
  }
}
```

### Response Codes
- **1000-1099**: Success responses
- **2000-2099**: Client errors (validation, not found)
- **3000-3099**: Server errors
- **4000-4099**: Authentication/Authorization errors

### ApiResponse Utility
```javascript
const ApiResponse = require('./utility/ApiResponse');

// Success
return ApiResponse(res, 'SUCCESS', data);

// Error
return ApiResponse(res, 'NOT_FOUND');
```

### Module Generator CLI
Automatically generate new modules with MVC pattern:
```bash
cd server && npm run generate:module
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install root dependencies:**
   ```bash
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure database:**
   
   **Option A: Local Prisma Postgres (Recommended)**
   ```bash
   cd server
   npx prisma dev
   ```
   
   **Option B: Custom Database**
   - Copy `server/.env.example` to `server/.env`
   - Update `DATABASE_URL` with your connection string
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   ```

4. **Run database migrations:**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client:**
   ```bash
   cd server
   npx prisma generate
   ```

## 🚦 Running the Application

### Development Mode
Start both frontend and backend simultaneously:
```bash
npm run dev
```

This runs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Individual Services

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
npm run preview
```

## 🗄️ Database

### View Database
Open Prisma Studio to view/edit data:
```bash
cd server
npx prisma studio
```

### Common Prisma Commands
```bash
npx prisma migrate dev       # Create & apply migration
npx prisma generate          # Regenerate Prisma Client
npx prisma db push           # Push schema without migration
npx prisma db pull           # Pull schema from database
npx prisma migrate reset     # Reset database
```

## 📝 Environment Variables

### Server (`server/.env`)
```env
PORT=3000
DATABASE_URL="your_database_connection_string"
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express server only |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

**Server Scripts:**
| Command | Description |
|---------|-------------|
| `cd server && npm run generate:module` | Generate new module with CLI |

## 🎨 Development Workflow

### 1. Generate a New Module
```bash
cd server
npm run generate:module
# Follow prompts to create controller, service, and routes
```

### 2. Define Database Model
Edit `server/prisma/schema.prisma`:
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. Apply Migration
```bash
cd server
npx prisma migrate dev --name add_product
npx prisma generate
```

### 4. Use Standardized Responses
All controllers automatically use `ApiResponse`:
```javascript
const ApiResponse = require('../../utility/ApiResponse');

// In controller
return ApiResponse(res, 'SUCCESS', data);
return ApiResponse(res, 'NOT_FOUND');
return ApiResponse(res, 'CREATED', newItem);
```

### 5. Frontend API Calls
```javascript
import { exampleApi } from './api';

// Fetch data
const result = await exampleApi.getAll();
if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.message);
}
```

## 📚 Documentation

- **[CODING_STANDARDS.txt](server/CODING_STANDARDS.txt)** - Complete coding standards and conventions
- **[QUICK_REFERENCE.md](server/QUICK_REFERENCE.md)** - Quick reference for common patterns
- **[MODULE-GENERATOR.md](server/MODULE-GENERATOR.md)** - Module generator usage guide

## 🎯 Coding Standards

This project follows strict coding standards. Key points:

- **Response Format**: All API responses use standardized format with response codes 1000+
- **MVC Pattern**: Services handle logic, controllers handle HTTP
- **Naming**: camelCase for variables, PascalCase for classes, UPPER_SNAKE_CASE for constants
- **Error Handling**: Services return `{ success, data/error }`, controllers use `ApiResponse`
- **Documentation**: JSDoc comments for all public functions

**See [CODING_STANDARDS.txt](server/CODING_STANDARDS.txt) for complete guidelines.**

## 🔍 API Response Format

All endpoints return responses in this format:
```json
{
  "responseCode": 1000,
  "responseMessage": "Success",
  "responseData": {
    "result": {
      "id": "123",
      "name": "Example"
    }
  }
}
```

**Response Codes:**
- `1000-1099`: Success
- `2000-2099`: Client errors
- `3000-3099`: Server errors
- `4000-4099`: Auth errors
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📄 License

ISC
