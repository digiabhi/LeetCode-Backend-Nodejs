import axios, { AxiosResponse } from "axios";
import {serverConfig} from "../config";
import {InternalServerError} from "../utils/errors/app.error";
import logger from "../config/logger.config";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    testcases: ITestCase[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProblemResponse {
    success: boolean;
    message: string;
    data: IProblemDetails;
}

export async function getProblemById(problemId: string):Promise<IProblemDetails | null> {
    
    try {
        const response: AxiosResponse<IProblemResponse> = await axios.get(`${serverConfig.PROBLEM_SERVICE}/problems/${problemId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new InternalServerError("Failed to fetch problem details");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                logger.error(`Problem service responded with error - Status: ${error.response.status}, Message: ${error.response.data?.message || error.message}`);
            } else if (error.request) {
                logger.error('Problem service request failed - No response received');
            } else {
                logger.error(`Problem service request configuration error: ${error.message}`);
            }
            if (error.code === 'ECONNABORTED') {
                logger.error('Problem service request timeout');
            }
        } else {
            logger.error('Unexpected error while fetching problem details:', error);
        }
        return null;
    }
}