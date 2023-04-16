import { Entity } from 'redis-om';
import { CustomMap } from '../custom/custom-map.js';
import { Credentials } from '../interfaces/credentials.js';

export class Project extends Entity {
    public ticker: string;
    public owners_credentials: CustomMap<string, Credentials>;
}
