import {ISubmission, ISubmissionData, Submission, SubmissionStatus} from "../models/submission.model";

export interface ISubmissionRepository {
    create(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    findByProblemId(problemId: string): Promise<ISubmission[]>;
    findById(id: string): Promise<ISubmission | null>;
    deleteById(id: string): Promise<boolean>;
    updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
    async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        return await Submission.create(submissionData);
    }

    async findById(id: string): Promise<ISubmission | null> {
        return await Submission.findById(id);
    }

    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        return await Submission.find({problemId}).sort({createdAt: -1});
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await Submission.findByIdAndDelete(id);
        return result !== null;
    }

    async updateStatus(id: string, status: SubmissionStatus, submissionData: ISubmissionData): Promise<ISubmission | null> {
        return await Submission.findByIdAndUpdate(id, {status, submissionData}, {new: true});
    }
}