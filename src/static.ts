import { Logger } from 'tslog';
import { CustomUser } from './custom/custom-user';
import { Market } from './market';
import { Bundle } from './interfaces/bundle';
import { Project } from './interfaces/project';
import { createClient } from 'redis';
import { RedisClient } from './redis-client';

const logTime = process.env.NODE_ENV === 'development' ? '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}' : '';

export const logger = new Logger({
    prettyLogTemplate: `${logTime}\t{{logLevelName}}\t{{name}}`
});

export const client = createClient({
    url: process.env.REDIS_URL
});

await client.connect();

export const users: RedisClient<CustomUser> = new RedisClient('users');
export const projects: RedisClient<Project> = new RedisClient('projects');
export const bundles: RedisClient<Bundle> = new RedisClient('bundles');

export const market = new Market();
