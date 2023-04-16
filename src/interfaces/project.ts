import { CustomMap } from '../custom/custom-map.js';
import { Credentials } from './credentials.js';

export interface Project {
    ticker: string,
    owners_credentials: CustomMap<string, Credentials>
}
