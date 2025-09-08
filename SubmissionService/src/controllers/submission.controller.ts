import {SubmissionService} from "../services/submission.service";
import {Request, Response} from "express";

export class SubmissionController {
    private submissionService: SubmissionService;

    constructor(submissionService: SubmissionService) {
        this.submissionService = submissionService;
    }

    createSubmission = async (req: Request, res: Response) => {
        const submission = await this.submissionService.createSubmission(req.body);
        res.status(201).json({
            success: true,
            message: 'Submission created successfully',
            data: submission
        });
    };

    getSubmissionById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const submission = await this.submissionService.getSubmissionById(id);
        res.status(200).json({
            success: true,
            message: 'Submission retrieved successfully',
            data: submission
        });
    };

    getSubmissionsByProblemId = async (req: Request, res: Response) => {
        const {problemId} = req.params;
        const submissions = await this.submissionService.getSubmissionsByProblemId(problemId);
        res.status(200).json({
            success: true,
            message: 'Submissions retrieved successfully',
            data: submissions
        });
    };

    deleteSubmissionById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const submission = await this.submissionService.deleteSubmissionById(id);
        res.status(200).json({
            success: true,
            message: 'Submission deleted successfully',
            data: submission
        });
    };

    updateSubmissionStatus = async (req: Request, res: Response) => {
        const {id} = req.params;
        const {status} = req.body;
        const submission = await this.submissionService.updateSubmissionStatus(id, status);
        res.status(200).json({
            success: true,
            message: 'Submission status updated successfully',
            data: submission
        });
    }
}