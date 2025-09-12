# EvaluatorService

A microservice for evaluating code submissions in a LeetCode-like coding platform. This service handles the execution and testing of submitted code against test cases, providing real-time evaluation results.

## Features

- ✅ Code execution in isolated Docker containers
- ✅ Support for multiple programming languages (C++, Python)
- ✅ Real-time evaluation of submissions against test cases
- ✅ Queue-based processing with BullMQ for scalability
- ✅ Secure sandboxed execution environment
- ✅ Integration with SubmissionService for status updates
- ✅ MongoDB integration for logging and result storage
- ✅ Redis integration for queue management
- ✅ TypeScript support with strict type checking
- ✅ Express.js REST API
- ✅ Winston logging with daily file rotation
- ✅ Docker container management with Dockerode
- ✅ Comprehensive error handling and timeout management

## Architecture

The service follows a microservice architecture pattern with:

- **Workers**: Background job processors for code evaluation
- **Queues**: BullMQ integration for job management
- **Controllers**: HTTP request handlers for evaluation endpoints
- **Utils**: Docker container management and execution utilities
- **Validators**: Request validation and sanitization
- **Middlewares**: Authentication and request processing
- **Interfaces**: TypeScript interfaces for type safety

## Prerequisites

- Node.js (v18 or higher)
- Docker (for code execution containers)
- Redis instance (for BullMQ queues)
- MongoDB instance (for logging and results)

## Steps to Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EvaluatorService
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
   PORT=3002
   REDIS_HOST=localhost
   REDIS_PORT=6379
   SUBMISSION_SERVICE_URL=http://localhost:3001/api/v1
   PROBLEM_SERVICE_URL=http://localhost:3000/api/v1
   ```

4. **Docker Setup**

   Ensure Docker is running

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Evaluation Process

1. **Job Reception** - Receives evaluation jobs from the submission queue
2. **Container Setup** - Creates isolated Docker container for the specific language
3. **Code Compilation** - Compiles the submitted code (for compiled languages)
4. **Test Execution** - Runs code against all test cases
5. **Result Collection** - Collects execution results, runtime, and memory usage
6. **Status Update** - Updates submission status in SubmissionService
7. **Cleanup** - Removes Docker containers and temporary files

## Supported Languages

- **C++** (`cpp`) - Uses GCC compiler with C++17 standard
- **Python** (`python`) - Uses Python 3.9 interpreter

## Queue Integration

The service processes evaluation jobs from BullMQ queues:
- Listens to `evaluationQueue` for incoming submissions
- Updates submission status throughout the evaluation process
- Handles job failures and retries automatically

## Security Features

- **Sandboxed Execution**: All code runs in isolated Docker containers
- **Resource Limits**: Memory and CPU usage restrictions
- **Timeout Management**: Prevents infinite loops and long-running processes
- **Network Isolation**: Containers have no network access
- **File System Protection**: Read-only file systems with limited write access

## Logging

Winston is configured with daily rotating file logs stored in the `logs/` directory:
- Application logs with detailed execution traces
- Error logs for debugging failed evaluations
- Performance metrics and timing information

## Docker Container Management

Uses Dockerode for:
- Dynamic container creation and destruction
- Resource monitoring and limits
- Secure file transfer to/from containers
- Container lifecycle management

## Integration with Other Services

- **SubmissionService**: Receives jobs and updates submission status
- **ProblemService**: Fetches problem details and test cases
- **Redis**: Queue management and caching
- **MongoDB**: Result logging and analytics

## Performance Considerations

- Concurrent evaluation processing with configurable worker pools
- Container reuse strategies for improved performance
- Memory and CPU optimization for high-throughput scenarios
- Automatic cleanup of resources to prevent memory leaks