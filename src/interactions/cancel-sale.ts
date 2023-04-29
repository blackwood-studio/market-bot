import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger } from '../static';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';
import { does_project_not_exists, is_ticker_invalid, items_are_not_for_sale } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { Parameters } from '../general/parameters';

export async function cancel_sale(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.ticker = interaction.options.getString('ticker');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New cancel sale request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (items_are_not_for_sale(parameters.source_bundle)) {
        logger.error(`New cancel sale request ... FAILED`);
        return show_error(
            ErrorCode.ITEMS_ARE_NOT_FOR_SALE,
            parameters
        );
    }

    parameters.source_bundle.items_amount_for_sale = 0;
    parameters.source_bundle.price_per_item = 0.00;
    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);

    logger.info(`New cancel sale request ... SUCCESS`);
    return show_success(`Sale has successfully been canceled`);
}
