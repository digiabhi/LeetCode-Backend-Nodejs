import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import {
  appErrorHandler,
  genericErrorHandler,
} from './middlewares/error.midleware';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import logger from './config/logger.config';
import {startWorkers} from "./workers/evaluation.worker";

const app = express();

app.use(express.json());
app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(appErrorHandler);
app.use(genericErrorHandler);

// async function testCPPCode() {
//     const cppCode = `
//     #include <iostream>
//     using namespace std;
//     int main() {
//         cout << "Hello, World!";
//         return 0;
//     }
//     `;
//     await runCode({
//         code: cppCode,
//         language: 'cpp',
//         timeout: 10000,
//         imageName: CPP_IMAGE,
//         input: '6'
//         }
//     )
// }

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  await startWorkers();
  logger.info('Workers started successfully');
  // await pullAllImages();
  // logger.info('Images pulled');
  // await testCPPCode();
});

