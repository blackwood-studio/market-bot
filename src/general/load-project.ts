import { projects } from '../static.js';
import { CustomUser } from '../custom/custom-user.js';
import { Project } from '../interfaces/project.js';
import { Credentials } from '../interfaces/credentials.js';
import { CustomMap } from '../custom/custom-map.js';

export async function load_project(owner: CustomUser, ticker: string): Promise<Project> {
    const owners_credentials: CustomMap<Credentials> = {};
    owners_credentials[owner.id] = owner.credentials;

    return await projects.get(ticker) || {
        ticker,
        owners_credentials
    };
}
