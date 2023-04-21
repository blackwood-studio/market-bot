import { Credentials } from './credentials';

export interface Bundle {
    ticker: string,
    owner_credentials: Credentials,
    items_amount: number,
    price_per_item: number,
    items_amount_for_sale: number
}
