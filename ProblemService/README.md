# ProblemService

A microservice for managing coding problems in a LeetCode-like coding platform. This service provides APIs for creating, retrieving, updating, and deleting coding problems with test cases and editorial content.

## Features

- ✅ Create and manage coding problems
- ✅ Support for multiple difficulty levels (Easy, Medium, Hard)
- ✅ Test case management for each problem
- ✅ Editorial content with markdown support
- ✅ Problem search functionality
- ✅ Filter problems by difficulty
- ✅ MongoDB integration with Mongoose ODM
- ✅ TypeScript support with strict type checking
- ✅ Express.js REST API
- ✅ Markdown sanitization for security
- ✅ Input validation with comprehensive error handling
- ✅ Versioned API endpoints (v1, v2)

## Architecture

The service follows a clean architecture pattern with:

- **Models**: MongoDB schemas for problems and test cases
- **Services**: Business logic for problem management
- **Controllers**: HTTP request handlers
- **Repositories**: Data access layer
- **DTOs**: Data transfer objects for validation
- **Validators**: Request validation and sanitization
- **Utilities**: Markdown sanitizer and error handling

## Prerequisites

- Node.js (v18 or higher)
- MongoDB instance

## Steps to Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProblemService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the sample environment file:
   ```bash
   cp .sample.env .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   DB_URL=mongodb://localhost:27017/leetcode_problems
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Version 1 (v1) - `/api/v1`

#### Problems
- `POST /api/v1/problems` - Create a new problem
- `GET /api/v1/problems` - Get all problems
- `GET /api/v1/problems/:id` - Get problem by ID
- `PUT /api/v1/problems/:id` - Update problem
- `DELETE /api/v1/problems/:id` - Delete problem
- `GET /api/v1/problems/difficulty/:difficulty` - Filter problems by difficulty
- `GET /api/v1/problems/search?q=query` - Search problems

#### Health Check
- `GET /api/v1/ping` - Health check endpoint

### Version 2 (v2) - `/api/v2`
*Future API versions for enhanced features*

## Problem Schema

### Problem Model
```typescript
{
  title: string;           // Problem title (max 100 characters, unique)
  description: string;     // Problem description (markdown supported)
  difficulty: string;      // "Easy" | "Medium" | "Hard"
  editorial?: string;      // Optional editorial content (markdown supported)
  testcases: ITestCase[];  // Array of test cases
  createdAt: Date;
  updatedAt: Date;
}
```