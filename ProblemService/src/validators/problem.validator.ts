import { z } from "zod";

export const createProblemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    editorial: z.string().optional(),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1),
    })).optional()
});

export const updateProblemSchema = createProblemSchema.partial();
export const findByDifficultySchema = z.object({
    difficulty:z.enum(['Easy', 'Medium', 'Hard'])
});
export type CreateProblemDTO = z.infer<typeof createProblemSchema>;
export type UpdateProblemDTO = z.infer<typeof updateProblemSchema>;