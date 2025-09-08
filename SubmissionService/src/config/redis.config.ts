import Redis from 'ioredis';
import logger from "./logger.config";

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost' ,
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
}

export const redis = new Redis(redisConfig);

redis.on('connect', () => logger.info('Redis Client Connected'));

redis.on('error', (err) => logger.error('Redis Client Error', err));

export const createNewRedisConnection = () =>{
    return new Redis(redisConfig);
}