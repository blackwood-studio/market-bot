import { Logger } from 'tslog';
import { CustomMap } from './custom/custom-map.js';
import { CustomUser } from './custom/custom-user.js';
import { Market } from './market.js';
import { Client } from 'redis-om';
import { project_schema } from './schemas/project-schema.js';
import { Bundle } from './interfaces/bundle.js';
import { Project } from './interfaces/project.js';

export const logger = new Logger({
    prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{name}}'
});

export const client = new Client();
await client.open(process.env.REDIS_URL);

export const users: CustomMap<string, CustomUser> = new CustomMap();
export const projects: CustomMap<string, Project> = new CustomMap(project_schema);
export const bundles: CustomMap<string, Bundle> = new CustomMap();
export const market: Market = new Market();
