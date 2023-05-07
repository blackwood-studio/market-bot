import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger } from '../static';
import { does_project_not_exists, has_not_enough_items, is_items_amount_invalid, is_money_amount_invalid, is_ticker_invalid, items_are_for_sale } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';
import { Parameters } from '../general/parameters';

export async function sell_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.ticker = interaction.options.getString('ticker');
    parameters.items_amount = interaction.options.getInteger('items_amount');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);
    parameters.price_per_item = interaction.options.getNumber('price_per_item')

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (is_items_amount_invalid(parameters.items_amount)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_ITEMS_AMOUNT,
            parameters
        );
    }

    if (is_money_amount_invalid(parameters.price_per_item)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_MONEY_AMOUNT,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (items_are_for_sale(parameters.source_bundle)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            ErrorCode.ITEMS_ARE_FOR_SALE,
            parameters
        );
    }

    if (has_not_enough_items(parameters.source_bundle, parameters.items_amount)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            ErrorCode.HAS_NOT_ENOUGH_ITEMS,
            parameters
        );
    }

    parameters.source_bundle.items_amount_for_sale = parameters.items_amount;
    parameters.source_bundle.price_per_item = parameters.price_per_item;
    
    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);

    logger.info(`New sell items request ... SUCCESS`);
    return show_success(`Sale has successfully been posted`);
}
