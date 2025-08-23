import {IProblem} from "../models/problems.model";
import {CreateProblemDTO, UpdateProblemDTO} from "../dtos/problem.dto";
import {IProblemRepository} from "../repositories/problem.repository";
import {BadRequestError, NotFoundError} from "../utils/errors/app.error";
import {sanitizeMarkdown} from "../utils/markdown.sanitizer";

export interface IProblemService {
    createProblem(problem: CreateProblemDTO): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(): Promise<{problems: IProblem[], total: number}>;
    updateProblem(id: string, updateData: UpdateProblemDTO): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
    private problemRepository: IProblemRepository;

    constructor(problemRepository: IProblemRepository) {
        this.problemRepository = problemRepository;
    }

    async createProblem(problem: CreateProblemDTO): Promise<IProblem> {
        const sanitizedPayload = {
            ...problem,
            description: await sanitizeMarkdown(problem.description),
            editorial: problem.editorial && await sanitizeMarkdown(problem.editorial)
        }
        return await this.problemRepository.createProblem(sanitizedPayload);
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem) {
            throw new NotFoundError('Problem not found');
        }
        return problem
    }

    async getAllProblems(): Promise<{problems: IProblem[], total: number}> {
        return await this.problemRepository.getAllProblems();
    }

    async updateProblem(id: string, updateData: UpdateProblemDTO): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem) {
            throw new NotFoundError('Problem not found');
        }
        const sanitizedPayload:Partial<IProblem> = {
            ...updateData
        }
        if(updateData.description) {
            sanitizedPayload.description = await sanitizeMarkdown(updateData.description);
        }
        if(updateData.editorial) {
            sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
        }
        return await this.problemRepository.updateProblem(id, sanitizedPayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem) {
            throw new NotFoundError('Problem not found');
        }
        return await this.problemRepository.deleteProblem(id);
    }

    async findByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]> {
        return await this.problemRepository.findByDifficulty(difficulty);
    }

    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === '') {
            throw new BadRequestError('Search query cannot be empty');
        }
        return await this.problemRepository.searchProblems(query);
    }
}