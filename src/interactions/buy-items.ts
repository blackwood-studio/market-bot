import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger, users } from '../static';
import { does_project_not_exists, has_not_enough_money, is_target_bot, is_target_source, is_ticker_invalid, items_are_not_for_sale } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { show_success } from '../embeds/show-success';
import { load_bundle } from '../general/load-bundle';
import { round_number } from '../general/round';
import { Parameters } from '../general/parameters';

export async function buy_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.target = await load_user(interaction.options.getUser('target'));
    parameters.ticker = interaction.options.getString('ticker');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);
    parameters.target_bundle = await load_bundle(parameters.target, parameters.ticker);
    parameters.price = round_number(parameters.target_bundle.price_per_item * parameters.target_bundle.items_amount_for_sale);

    if (is_target_bot(parameters.target)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            ErrorCode.IS_BOT,
            parameters
        );
    }

    if (is_target_source(parameters.target, parameters.source)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            ErrorCode.TARGET_IS_SOURCE,
            parameters
        );
    }

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (has_not_enough_money(parameters.source, parameters.price)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            ErrorCode.HAS_NOT_ENOUGH_MONEY,
            parameters
        );
    }

    if (items_are_not_for_sale(parameters.target_bundle)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            ErrorCode.ITEMS_ARE_NOT_FOR_SALE,
            parameters
        );
    }

    parameters.source_bundle.items_amount += parameters.target_bundle.items_amount_for_sale;
    parameters.target_bundle.items_amount -= parameters.target_bundle.items_amount_for_sale;
    
    parameters.source.money_amount = round_number(parameters.source.money_amount - parameters.price);
    parameters.target.money_amount = round_number(parameters.target.money_amount + parameters.price);

    parameters.target_bundle.items_amount_for_sale = 0;

    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);
    await bundles.set(`${parameters.target.id}::${parameters.ticker}`, parameters.target_bundle);

    await users.set(parameters.source.id, parameters.source);
    await users.set(parameters.target.id, parameters.target);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Purchase was successful`);
}
