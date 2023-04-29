import { CustomUser } from '../custom/custom-user';
import { Bundle } from '../interfaces/bundle';
import { Project } from '../interfaces/project';

export interface Parameters {
    source?: CustomUser,
    target?: CustomUser,
    ticker?: string,
    money_amount?: number,
    items_amount?: number,
    project?: Project,
    source_bundle?: Bundle,
    target_bundle?: Bundle,
    bundles?: Bundle[],
    price?: number,
    price_per_item?: number
}
