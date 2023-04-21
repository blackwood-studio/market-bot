import { projects } from '../static';
import { CustomUser } from '../custom/custom-user';
import { Project } from '../interfaces/project';
import { Credentials } from '../interfaces/credentials';
import { CustomMap } from '../custom/custom-map';

export async function load_project(owner: CustomUser, ticker: string): Promise<Project> {
    const owners_credentials: CustomMap<Credentials> = {};
    owners_credentials[owner.id] = owner.credentials;

    return await projects.get(ticker) || {
        ticker,
        owners_credentials
    };
}
