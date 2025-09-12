import mongoose, { Document, model } from "mongoose";

export enum SubmissionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export interface ISubmissionData {
    testCaseId: string;
    status: string;
}

export enum SubmissionLanguage {
    CPP = 'cpp',
    PYTHON = 'python',
}

export interface ISubmission extends Document {
    problemId: string;
    code: string;
    language: SubmissionLanguage;
    status: SubmissionStatus;
    submissionData: ISubmissionData;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>({
    problemId: { type: String, required: [true, "Problem ID is required for submission"]},
    code: { type: String, required: [true, "Code is required for evaluation"] },
    language: { type: String, required: [true, "Language is required for evaluation"], enum: Object.values(SubmissionLanguage)},
    status: { type: String, enum: Object.values(SubmissionStatus), default: SubmissionStatus.PENDING },
    submissionData: { type: Object, required: true, default: {} },
}, {
    timestamps: true,
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v; // Remove the __v field
            record.id = record._id; // Add id field with _id value
            delete record._id; // Remove _id field
            return record;
        }
    }
});

submissionSchema.index({ status: 1, createdAt: -1 });

export const Submission = model<ISubmission>('Submission', submissionSchema);