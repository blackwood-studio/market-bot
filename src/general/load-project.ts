import { projects } from '../static.js';
import { CustomUser } from '../custom/custom-user.js';
import { Project } from '../interfaces/project.js';
import { CustomMap } from '../custom/custom-map.js';

export async function load_project(owner: CustomUser, ticker: string): Promise<Project> {
    return await projects.get(ticker) || {
        ticker,
        owners_credentials: new CustomMap([[ 
            owner.id, 
            owner.credentials
        ]])
    };
}
