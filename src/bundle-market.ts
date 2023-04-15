import { CustomMap } from './custom/custom-map';
import { Bundle } from './interfaces/bundle';
import { Project } from './interfaces/project';

export class BundleMarket {
    public bundles: CustomMap<string, Bundle> = new CustomMap();
    public projects: CustomMap<string, Project> = new CustomMap();
}
