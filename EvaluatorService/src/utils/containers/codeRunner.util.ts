import {createNewDockerContainer} from "./createContainer.util";
import {InternalServerError} from "../errors/app.error";
import {commands} from "./commands.util";

const allowListedLanguages = ['python', 'cpp'];

export interface RunCodeOptions {
    code: string;
    language: 'python' | 'cpp';
    timeout: number;
    imageName: string;
}

export async function runCode(options: RunCodeOptions){
    const {code, language, timeout, imageName} = options;

    if(!allowListedLanguages.includes(language)){
        throw new InternalServerError(`Unsupported language: ${language}`);
    }

    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: commands[language](code),
        memoryLimit: 1024 * 1024 * 1024,
    });

    const timeLimitExceededTimeout = setTimeout(async () => {
        console.log("Time limit exceeded, stopping container...");
        container?.kill();
    }, timeout);

    console.log("Container created successfully:", container?.id);
    await container?.start();
    const status = await container?.wait();
    console.log("Container status:", status);

    const logs = await container?.logs({
        stdout: true,
        stderr: true,
    });

    console.log("Container logs:", logs?.toString());

    await container?.remove();

    await clearTimeout(timeLimitExceededTimeout);

    if(status?.StatusCode === 0){
        console.log("Container exited successfully");
    } else {
        console.log("Container exited with error");
    }
}