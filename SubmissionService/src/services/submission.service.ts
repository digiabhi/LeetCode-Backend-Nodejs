import {ISubmission, ISubmissionData, SubmissionStatus} from "../models/submission.model";
import {ISubmissionRepository} from "../repositories/submission.repository";
import {BadRequestError, NotFoundError} from "../utils/errors/app.error";
import {getProblemById} from "../api/problem.api";
import {addSubmissionJob} from "../producers/submission.producer";
import logger from "../config/logger.config";

export interface ISubmissionService {
    createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        if(!submissionData.problemId) throw new BadRequestError('Problem ID is required');
        if(!submissionData.code) throw new BadRequestError('Code is required');
        if(!submissionData.language) throw new BadRequestError('Language is required');

       const problem = await getProblemById(submissionData.problemId);

       if(!problem) throw new NotFoundError('Problem not found');

       const submission = await this.submissionRepository.create(submissionData);

       const jobId = await addSubmissionJob({
           submissionId: submission.id,
           problem,
           code: submissionData.code,
           language: submissionData.language,
           });

       logger.info(`Submission job added with ID: ${jobId}`);

       return submission;
    }

    async getSubmissionById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError('Submission not found');
        }
        return submission;
    }

    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        return await this.submissionRepository.findByProblemId(problemId);
    }

    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = this.submissionRepository.deleteById(id);
        if (!result) {
            throw new NotFoundError('Submission not found');
        }
        return result;
    }

    async updateSubmissionStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if (!submission) {
            throw new NotFoundError('Submission not found');
        }
        return await this.submissionRepository.updateStatus(id, status, submissionData);
    }
}