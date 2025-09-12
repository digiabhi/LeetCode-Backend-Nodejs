# LeetCode Backend (Microservices)

A Node.js + TypeScript backend organized as three microservices for a LeetCode‑like coding platform. Each service is independently runnable and exposes versioned REST APIs.

This README consolidates only what is present and implemented in this repository.

## Services Overview

- ProblemService (default port: 3000)
  - Manages coding problems, difficulties, search, and test cases.
  - Exposes versioned APIs (/api/v1, /api/v2 placeholder).
  - Uses MongoDB via Mongoose.

- SubmissionService (default port: 3001)
  - Manages code submissions and their status lifecycle.
  - Queues submissions for evaluation via BullMQ (Redis).
  - Uses MongoDB via Mongoose.

- EvaluatorService (default port: 3002)
  - Evaluates code securely using Docker containers.
  - Consumes jobs from BullMQ queues and updates submission status.
  - Integrates with Redis and (per service README) MongoDB for logging/results.

A Postman collection is available at: Leetcode.postman_collection.json

## Tech Stack (as implemented across services)

- Node.js (v18+), TypeScript
- Express.js
- MongoDB (Mongoose ODM) — ProblemService, SubmissionService (and noted for EvaluatorService logging)
- Redis + BullMQ — queues for submissions/evaluation
- Docker/Dockerode — sandboxed code execution (EvaluatorService)
- Zod — request validation (used in ProblemService and SubmissionService, and referenced in EvaluatorService)
- Winston — logging with daily rotation

## Repository Structure

- ProblemService/
- SubmissionService/
- EvaluatorService/
- Leetcode.postman_collection.json

## Getting Started

Each service runs independently. Open a terminal in the respective service folder and follow these steps.

### Common prerequisites
- Node.js 18+
- MongoDB running locally (for services that use it)
- Redis running locally (for queue-enabled services)
- Docker running (required for EvaluatorService)

### ProblemService (port 3000)
1) Install dependencies
   npm install
2) Configure environment (.env)
   PORT=3000
   DB_URL=mongodb://localhost:27017/leetcode_problems
3) Run in development
   npm run dev
4) Build and start
   npm run build
   npm start

Key routes under /api/v1:
- POST   /api/v1/problems
- GET    /api/v1/problems
- GET    /api/v1/problems/:id
- PUT    /api/v1/problems/:id
- DELETE /api/v1/problems/:id
- GET    /api/v1/problems/difficulty/:difficulty
- GET    /api/v1/problems/search
- GET    /api/v1/ping

Notes:
- /api/v2 is present as a placeholder in routing.

### SubmissionService (port 3001)
1) Install dependencies
   npm install
2) Configure environment (.env)
   PORT=3001
   DB_URL=mongodb://localhost:27017/leetcode_submissions
   REDIS_HOST=localhost
   REDIS_PORT=6379
   PROBLEM_SERVICE=http://localhost:3000/api/v1
3) Run in development
   npm run dev
4) Build and start
   npm run build
   npm start

Key routes under /api/v1:
- POST   /api/v1/submissions
- GET    /api/v1/submissions/:id
- GET    /api/v1/submissions/problem/:problemId
- PATCH  /api/v1/submissions/:id/status
- DELETE /api/v1/submissions/:id
- GET    /api/v1/ping

Submission status values (as implemented):
- PENDING, COMPILING, RUNNING, ACCEPTED, WRONG_ANSWER

### EvaluatorService (port 3002)
1) Install dependencies
   npm install
2) Configure environment (.env)
   PORT=3002
   REDIS_HOST=localhost
   REDIS_PORT=6379
   SUBMISSION_SERVICE_URL=http://localhost:3001/api/v1
   PROBLEM_SERVICE_URL=http://localhost:3000/api/v1
3) Ensure Docker is running
4) Run in development
   npm run dev
5) Build and start
   npm run build
   npm start

Key route under /api/v1:
- GET /api/v1/ping

Behavior (per implementation):
- Starts background workers that consume evaluation jobs from BullMQ.
- Executes submitted code in Docker containers (supports at least C++ and Python as noted in the service README and utilities).
- Updates submission status back to SubmissionService.

## Logging
- Each service uses Winston with daily rotation, writing to the service-specific logs/ directory.

## Validation and Error Handling
- Middlewares for correlation IDs and error handling are wired in each service.
- Zod-based validators are used where present in the code to validate request bodies/params.

## Notes
- Only the features and endpoints listed above are drawn from the code and service-level READMEs in this repository.
- Ports are configurable via environment variables; defaults shown reflect the service READMEs and server setup.
