import { projects } from '../static.js';
import { CustomUser } from '../custom/custom-user.js';
import { Project } from '../interfaces/project.js';
import { CustomMap } from '../custom/custom-map.js';

export function load_project(owner: CustomUser, ticker: string): Project {
    return projects.get(ticker) || {
        ticker,
        owners_credentials: new CustomMap([[ 
            owner.id, 
            owner.get_credentials()
        ]])
    };
}
