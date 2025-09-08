import {Worker} from "bullmq";
import {SUBMISSION_QUEUE} from "../utils/constants";
import logger from "../config/logger.config";
import {createNewRedisConnection} from "../config/redis.config";

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async(job) => {
        logger.info('Processing job:', job.id);
    },{connection: createNewRedisConnection()}
        );

    worker.on('error', (err) => {
        logger.error('Worker error:', err);
    });

    worker.on('completed', (job) => {
        logger.info('Job completed:', job.id);
    });

    worker.on('failed', (job, err) => {
        logger.error('Job failed:', job?.id, err);
    });
}

export async function startWorkers(){
    await setupEvaluationWorker();
}