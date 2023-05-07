import { EmbedBuilder } from 'discord.js';
import { Parameters } from '../general/parameters';

export enum ErrorCode {
    IS_BOT,
    TARGET_IS_SOURCE,
    INVALID_TICKER,
    INVALID_MONEY_AMOUNT,
    INVALID_ITEMS_AMOUNT,
    ITEMS_ARE_FOR_SALE,
    ITEMS_ARE_NOT_FOR_SALE,
    HAS_NOT_ENOUGH_MONEY,
    HAS_NOT_ENOUGH_ITEMS,
    PROJECT_EXISTS,
    PROJECT_NOT_EXISTS,
    NOT_OWNER_OF_PROJECT,
}

export function show_error(error_code: ErrorCode, parameters: Parameters): EmbedBuilder {
    let description: string;
    let tip: string;

    switch(error_code) {
        case ErrorCode.IS_BOT:
            description = `Option 'target' is invalid`,
            tip = `Option 'target' can only be a real user`
            break;

        case ErrorCode.TARGET_IS_SOURCE:
            description = `Option 'target' is invalid`,
            tip = `Cannot choose yourself as 'target'`
            break;

        case ErrorCode.INVALID_TICKER:
            description = `Option 'ticker' is invalid`;
            tip = `Option 'ticker' must follow the pattern A-Z, 0-9, . and max length 28`;
            break;

        case ErrorCode.INVALID_MONEY_AMOUNT:
            description = `Option 'money_amount' is invalid`;
            tip = `Option 'money_amount' cannot be negative or zero`;
            break;

        case ErrorCode.INVALID_ITEMS_AMOUNT:
            description = `Option 'items_amount' is invalid`;
            tip = `Option 'items_amount' cannot be negative or zero`;
            break;

        case ErrorCode.ITEMS_ARE_FOR_SALE:
            description = `Sale already exists`,
            tip = `You need to cancel the sale of '${parameters.source_bundle.ticker}'`
            break;

        case ErrorCode.ITEMS_ARE_NOT_FOR_SALE:
            description = `Items are not for sale`,
            tip = `User '${parameters.target.username}' does not sell '${parameters.target_bundle.ticker}'`
            break;

        case ErrorCode.HAS_NOT_ENOUGH_MONEY:
            description = `Not enough money`,
            tip = `User '${parameters.source.username}' is ${(parameters.price - parameters.source.money_amount).toFixed(2)}$ short`;
            break;

        case ErrorCode.HAS_NOT_ENOUGH_ITEMS:
            description = `Not enough items`,
            tip = `User '${parameters.source.username}' is ${parameters.items_amount - (parameters.source_bundle.items_amount - parameters.source_bundle.items_amount_for_sale)} items short`
            break;

        case ErrorCode.PROJECT_EXISTS:
            description = `Project does not exists`;
            tip = `Project '${parameters.ticker}' could not be found`;
            break;

        case ErrorCode.PROJECT_NOT_EXISTS:
            description = `Project already exists`;
            tip = `Project '${parameters.ticker}' already exists`;
            break;

        case ErrorCode.NOT_OWNER_OF_PROJECT:
            description = `Missing owner rights`;
            tip = `User '${parameters.source.username}' is not owner of '${parameters.ticker}'`;
            break;
    }

    return new EmbedBuilder()
    .setColor(0xe33900)
    .addFields(
        { 
            name: `❌ Error `, 
            value: `${description}` 
        },
        { 
            name: `💡 Tip`, 
            value: `${tip}` 
        }
    );
}
