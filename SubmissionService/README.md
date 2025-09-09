
# SubmissionService

A microservice for managing code submissions in a LeetCode-like coding platform. This service handles submission creation, status tracking, and evaluation queue management.

## Features

- ✅ Create and manage code submissions
- ✅ Support for multiple programming languages (C++, Python)
- ✅ Submission status tracking (pending, compiling, running, accepted, wrong_answer)
- ✅ Queue integration with BullMQ for evaluation processing
- ✅ MongoDB integration with Mongoose ODM
- ✅ TypeScript support with strict type checking
- ✅ Express.js REST API
- ✅ Winston logging with daily file rotation
- ✅ Input validation with Zod schemas

## Architecture

The service follows a clean architecture pattern with:

- **Models**: MongoDB schemas for submissions
- **Services**: Business logic for submission management
- **Controllers**: HTTP request handlers
- **Repositories**: Data access layer
- **Queues**: Background job processing with BullMQ
- **Validators**: Request validation with Zod

## Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- Redis instance (for BullMQ queues)

## Steps to Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SubmissionService
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
   PORT=3001
   DB_URL="mongodb://localhost:27017/leetcode_submissions"
   REDIS_HOST=localhost
   REDIS_PORT=6379
   PROBLEM_SERVICE="http://localhost:3000/api/v1"
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

### Submissions

- `POST /api/v1/submissions` - Create a new submission
- `GET /api/v1/submissions/:id` - Get submission by ID
- `GET /api/v1/submissions/problem/:problemId` - Get submissions by problem ID
- `PUT /api/v1/submissions/:id/status` - Update submission status
- `DELETE /api/v1/submissions/:id` - Delete submission

## Submission Status Flow

1. **PENDING** - Initial state when submission is created
2. **COMPILING** - Code is being compiled
3. **RUNNING** - Code is being executed against test cases
4. **ACCEPTED** - All test cases passed
5. **WRONG_ANSWER** - One or more test cases failed

## Supported Languages

- **C++** (`cpp`)
- **Python** (`python`)

## Queue Integration

The service uses BullMQ to queue submissions for evaluation by the EvaluatorService. Submissions are automatically queued when created and their status is updated as they progress through the evaluation pipeline.

## Logging

Winston is configured with daily rotating file logs stored in the `logs/` directory. Logs include:
- Application logs
- Error logs
- Combined logs

## Database Schema

### Submission Model
```typescript
{
  problemId: string;
  code: string;
  language: SubmissionLanguage;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}
```