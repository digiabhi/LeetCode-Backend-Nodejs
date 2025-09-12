import {Job, Worker} from "bullmq";
import {SUBMISSION_QUEUE} from "../utils/constants";
import logger from "../config/logger.config";
import {createNewRedisConnection} from "../config/redis.config";
import {EvaluationJob, EvaluationResult, TestCase} from "../interfaces/evaluation.interface";
import {runCode} from "../utils/containers/codeRunner.util";
import {LANGUAGE_CONFIG} from "../config/language.config";
import {updateSubmission} from "../api/submission.api";

function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    // Implement logic to match test cases with results
    const output: Record<string, string> = {};
    if(results.length !== testCases.length) {
        console.log('Test cases and results do not match');
        return
    }
    testCases.map((testCase, index) => {
        let returnVal = ""
        if(results[index].status === 'time_limit_exceeded') {
            returnVal = 'TLE';
        } else if(results[index].status === 'failed') {
            returnVal = 'Error';
        } else {
            if(results[index].output === testCase.output) {
                returnVal = 'AC';
            } else {
                returnVal = 'WA';
            }
        }
        output[testCase._id] = returnVal;
    });
    return output;
}

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async(job: Job) => {
        logger.info('Processing job:', job.id);
        const data: EvaluationJob = job.data;
        try {
            const testCasesRunnerPromise = data.problem.testcases.map(async (testCase) => {
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testCase.input,
                });
            })
            const testCasesRunnerResults = await Promise.all(testCasesRunnerPromise);

            console.log("Test case Runner results",testCasesRunnerResults);

            const output = matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResults);
            console.log("Output results:",output);
            await updateSubmission(data.submissionId, 'completed', output || {});
        } catch (error) {
            logger.error('Error evaluating code:', error);
            return;
        }

    },{
        connection: createNewRedisConnection()
    }
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