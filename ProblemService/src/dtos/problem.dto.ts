import {ITestCase} from "../models/problems.model";

export interface CreateProblemDTO {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    editorial?: string;
    testcases: ITestCase[];
}

export interface UpdateProblemDTO {
    title?: string;
    description?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    editorial?: string;
    testcases?: ITestCase[];
}

