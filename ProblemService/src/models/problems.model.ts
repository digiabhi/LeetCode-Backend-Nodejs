import mongoose, {Document} from "mongoose";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testcases: ITestCase[];
}

const testCaseSchema = new mongoose.Schema<ITestCase>({
    input: {
        type: String,
        required: [true, "Input is required"],
        trim: true
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true
    }
});

const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title can not be more than 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    difficulty: {
        type: String,
        enum: {
            values: ["Easy", "Medium", "Hard"],
            message: "Difficulty must be either Easy, Medium or Hard"
        },
        default: "Easy",
        required: [true, "Difficulty level is required"]
    },
    editorial: {
        type: String,
        trim: true
    },
    testcases: [testCaseSchema]
}, {
    timestamps: true,
    toJSON: {
        transform:(_, record) => {
            delete (record as any).__v; // Remove the __v field
            record.id = record._id; // Add id field with _id value
            delete record._id; // Remove _id field
            return record;
        }
    }
});

problemSchema.index({title: 1}, {unique: true});
problemSchema.index({difficulty: 1});

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);