import { bundle_market } from '../static';
import { CustomUser } from '../custom/custom-user';
import { Project } from '../interfaces/project';
import { CustomMap } from '../custom/custom-map';

export function load_project(owner: CustomUser, ticker: string): Project {
    return bundle_market.projects.get(ticker) || {
        ticker,
        owners_credentials: new CustomMap([[ 
            owner.id, 
            owner.get_credentials()
        ]])
    };
}
