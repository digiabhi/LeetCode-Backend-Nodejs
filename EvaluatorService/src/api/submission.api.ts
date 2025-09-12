import axios from "axios";
import {serverConfig} from "../config";
import {InternalServerError} from "../utils/errors/app.error";
import logger from "../config/logger.config";

export async function updateSubmission(submissionId: string, status: string, output: Record<string, string>){

    try {
        const url = `${serverConfig.SUBMISSION_SERVICE}/submissions/${submissionId}/status`;
        const response = await axios.patch(url, {status, submissionData: output});
        if (response.data.success) {
            logger.info(`Submission status updated successfully for submissionId: ${submissionId}`);
            return ;
        }
        throw new InternalServerError("Failed to update submission status");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                logger.error(`Submission service responded with error - Status: ${error.response.status}, Message: ${error.response.data?.message || error.message}`);
            } else if (error.request) {
                logger.error('Submission service request failed - No response received');
            } else {
                logger.error(`Submission service request configuration error: ${error.message}`);
            }
            if (error.code === 'ECONNABORTED') {
                logger.error('Submission service request timeout');
            }
        } else {
            logger.error('Unexpected error while fetching submission details:', error);
        }
        return null;
    }
}