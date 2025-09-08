import {Request, Response} from "express";
import { ProblemService} from "../services/problem.service";
import {ProblemRepository} from "../repositories/problem.repository";

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);

export const ProblemController = {

    async createProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.createProblem(req.body);
        res.status(201).json({
            success: true,
            message: 'Problem created successfully',
            data: problem
        });
    },

    async getProblemById(req: Request, res: Response): Promise<void> {
        const problem = await problemService.getProblemById(req.params.id);
        res.status(200).json({
            success: true,
            data: problem,
            message: 'Problem retrieved successfully'
        })
    },

    async getAllProblems(req: Request, res: Response): Promise<void> {
        const problems = await problemService.getAllProblems();
        res.status(200).json({
            success: true,
            data: problems,
            message: 'Problems retrieved successfully'
        });
    },

    async updateProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.updateProblem(req.params.id, req.body);
        if (!problem) {
            res.status(404).json({
                success: false,
                message: 'Problem not found',
                data: null
            });
        }
        res.status(200).json({
            success: true,
            data: problem,
            message: 'Problem updated successfully'
        })
    },

    async deleteProblem(req: Request, res: Response): Promise<void> {
        const problem = await problemService.deleteProblem(req.params.id);
        if (!problem) {
            res.status(404).json({
                success: false,
                message: 'Problem not found',
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully',
            data: problem
        })
    },

    async findByDifficulty(req: Request, res: Response): Promise<void> {
        const difficulty = req.params.difficulty as 'Easy' | 'Medium' | 'Hard';
        const problems = await problemService.findByDifficulty(difficulty);
        res.status(200).json({
            success: true,
            data: problems,
            message: 'Problems retrieved successfully'
        });
    },

    async searchProblems(req: Request, res: Response): Promise<void> {
        const problems = await problemService.searchProblems(req.query.query as string);
        res.status(200).json({
            success: true,
            data: problems,
            message: 'Problems retrieved successfully'
        })
    }
}