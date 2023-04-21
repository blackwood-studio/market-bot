import { Bundle } from '../interfaces/bundle';
import { CustomUser } from '../custom/custom-user';
import { bundles } from '../static';

export interface Filter {
    ticker?: string,
    owner_id?: string,
    only_for_sale?: boolean
}

export async function load_bundles(filter: Filter): Promise<Bundle[]> {
    return (await bundles.as_array())
    .filter((bundle: Bundle) => {
        return bundle.items_amount > 0 &&
               (filter.ticker ? bundle.ticker === filter.ticker : true) &&
               (filter.owner_id ? bundle.owner_credentials.id === filter.owner_id : true) &&
               (filter.only_for_sale ? bundle.items_amount_for_sale > 0 : true)
    });
}

export async function load_bundle(owner: CustomUser, ticker: string): Promise<Bundle> {
    return await bundles.get(`${owner.id}::${ticker}`) || {
        ticker,
        owner_credentials: owner.credentials,
        items_amount: 0,
        price_per_item: 0.00,
        items_amount_for_sale: 0
    };
}
