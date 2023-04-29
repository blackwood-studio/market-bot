import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger } from '../static';
import { does_project_not_exists, has_not_enough_items, is_items_amount_invalid, is_target_bot, is_target_source, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';
import { Parameters } from '../general/parameters';

export async function send_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.target = await load_user(interaction.options.getUser('target'));
    parameters.ticker = interaction.options.getString('ticker');
    parameters.items_amount = interaction.options.getInteger('items_amount');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);
    parameters.target_bundle = await load_bundle(parameters.target, parameters.ticker);

    if (is_target_bot(parameters.target)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            ErrorCode.IS_BOT,
            parameters
        );
    }

    if (is_target_source(parameters.source, parameters.target)) {
        logger.error(`New send item request ... FAILED`);
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

    if (is_items_amount_invalid(parameters.items_amount)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_ITEMS_AMOUNT,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New send items request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (has_not_enough_items(parameters.source_bundle, parameters.items_amount)) {
        logger.error(`New send items request ... FAILED`);
        return show_error(
            ErrorCode.HAS_NOT_ENOUGH_ITEMS,
            parameters
        );
    }

    parameters.source_bundle.items_amount -= parameters.items_amount;
    parameters.target_bundle.items_amount += parameters.items_amount;

    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);
    await bundles.set(`${parameters.target.id}::${parameters.ticker}`, parameters.target_bundle);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Items has successfully been sent`);
}
