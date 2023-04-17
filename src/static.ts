import { Logger } from 'tslog';
import { CustomMap } from './custom/custom-map.js';
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

export const users: RedisClient<string, CustomUser> = new RedisClient('users');
export const projects: RedisClient<string, Project> = new RedisClient('projects');
export const bundles: RedisClient<string, Bundle> = new RedisClient('bundles');

export const market = new Market();
