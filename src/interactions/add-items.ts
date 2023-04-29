import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger } from '../static';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';
import { does_project_not_exists, is_items_amount_invalid, is_not_owner_of_project, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { Parameters } from '../general/parameters';

export async function add_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.ticker = interaction.options.getString('ticker');
    parameters.items_amount = interaction.options.getInteger('items_amount');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (is_items_amount_invalid(parameters.items_amount)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_ITEMS_AMOUNT,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (await is_not_owner_of_project(parameters.source, parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.NOT_OWNER_OF_PROJECT,
            parameters
        );
    }

    parameters.source_bundle.items_amount += parameters.items_amount;
    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);

    logger.info(`New add items request ... SUCCESS`);
    return show_success(`Amout of items has successfully been increased`);
}
