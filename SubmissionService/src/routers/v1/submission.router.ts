import express from "express";
import {validateQueryParams, validateRequestBody} from "../../validators";
import {
    createSubmissionSchema,
    submissionQuerySchema,
    updateSubmissionStatusSchema
} from "../../validators/submission.validator";
import {SubmissionFactory} from "../../factories/submission.factory";

const submissionRouter = express.Router();

const submissionController = SubmissionFactory.getSubmissionController();

submissionRouter.post('/', validateRequestBody(createSubmissionSchema), submissionController.createSubmission);

submissionRouter.get('/:id', submissionController.getSubmissionById);

submissionRouter.get('/problem/:problemId', validateQueryParams(submissionQuerySchema), submissionController.getSubmissionsByProblemId);

submissionRouter.delete('/:id', submissionController.deleteSubmissionById);

submissionRouter.patch('/:id/status', validateRequestBody(updateSubmissionStatusSchema), submissionController.updateSubmissionStatus);

export default submissionRouter;