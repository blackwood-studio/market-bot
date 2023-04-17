import { CustomUser } from '../custom/custom-user.js';
import { Bundle } from '../interfaces/bundle.js';
import { projects } from '../static.js';

export function is_user_bot(user: CustomUser): boolean {
    return user.bot;
}

export function is_source_target(source: CustomUser, target: CustomUser): boolean {
    return source.id === target.id;
}

export function is_ticker_invalid(ticker: string): boolean {
    return !/^[A-Z0-9\.]+$/.test(ticker);
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
    return (await projects.get(ticker))?.owners_credentials.get(user.id) === undefined;
}

export async function does_project_exists(ticker: string): Promise<boolean> {
    return await projects.get(ticker) !== null;
}

export async function does_not_project_exists(ticker: string): Promise<boolean> {
    return await projects.get(ticker) === null;
}
