import { CustomMap } from '../custom/custom-map';
import { Credentials } from './credentials';

export interface Project {
    ticker: string,
    owners_credentials: CustomMap<Credentials>
}
