import { CustomUser } from '../custom/custom-user';
import { Bundle } from '../interfaces/bundle';
import { projects } from '../static';

export function is_target_bot(target: CustomUser): boolean {
    return target.bot;
}

export function is_target_source(target: CustomUser, source: CustomUser): boolean {
    return target.id === source.id;
}

export function is_ticker_invalid(ticker: string): boolean {
    return ticker.length > 28 || !/^[A-Z0-9\.]+$/.test(ticker);
}

export function is_money_amount_invalid(money_amount: number): boolean {
    return !(money_amount > 0.00);
}

export function is_items_amount_invalid(items_amount: number): boolean {
    return !(items_amount > 0);
}

export function has_not_enough_money(user: CustomUser, money_amount: number): boolean {
    return user.money_amount - money_amount < 0.00;
}

export function items_are_for_sale(bundle: Bundle): boolean {
    return bundle.items_amount_for_sale > 0;
}

export function items_are_not_for_sale(bundle: Bundle): boolean {
    return bundle.items_amount_for_sale === 0;
}

export function has_not_enough_items(bundle: Bundle, items_amount: number): boolean {
    return bundle.items_amount - bundle.items_amount_for_sale - items_amount < 0;
}

export async function is_not_owner_of_project(user: CustomUser, ticker: string): Promise<boolean> {
    return (await projects.get(ticker))?.owners_credentials[user.id] === undefined;
}

export async function does_project_exists(ticker: string): Promise<boolean> {
    return await projects.get(ticker) !== null;
}

export async function does_project_not_exists(ticker: string): Promise<boolean> {
    return await projects.get(ticker) === null;
}
