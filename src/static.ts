import { Logger } from 'tslog';
import { CustomUser } from './custom/custom-user.js';
import { Market } from './market.js';
import { Bundle } from './interfaces/bundle.js';
import { Project } from './interfaces/project.js';
import { createClient } from 'redis';
import { RedisClient } from './redis-client.js';

export const logger = new Logger({
    prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{name}}'
});

export const client = createClient({
    url: process.env.REDIS_URL
});

await client.connect();

export const users: RedisClient<CustomUser> = new RedisClient('users');
export const projects: RedisClient<Project> = new RedisClient('projects');
export const bundles: RedisClient<Bundle> = new RedisClient('bundles');

export const market = new Market();
