import { Schema } from 'redis-om';
import { Project } from '../entities/project.js';

export const project_schema = new Schema(Project, {
    ticker: { type: 'string' },
    owners_credentials: { type: 'string[]' }
}, {
    dataStructure: 'HASH'
});
