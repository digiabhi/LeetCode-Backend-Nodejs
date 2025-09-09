import logger from "../../config/logger.config";
import Docker from "dockerode";

export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number;
}



export async function createNewDockerContainer(options: CreateContainerOptions) {
    try {
        const docker = new Docker();
        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            OpenStdin: true, // keep the input stream open even if no input is provided
            HostConfig: {
                Memory: options.memoryLimit,
                PidsLimit: 100, // to limit the number of processes
                CpuQuota: 50000,
                CpuPeriod: 100000,
                SecurityOpt: ['no-new-privileges'],
                NetworkMode: 'none',
            },
        });

        logger.info('Container created successfully', container.id);
        return container;
    } catch (error) {
        logger.error('Error creating container:', error);
        return null;
    }
}