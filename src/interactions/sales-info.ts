import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { logger } from '../static';
import { bundles_to_table } from '../tables/bundles-table';
import { load_bundles } from '../general/load-bundle';
import { show_sales_info } from '../embeds/show-sales-info';
import { does_project_not_exists, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { Parameters } from '../general/parameters';

export async function sales_info(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.ticker = interaction.options.getString('ticker');
    parameters.bundles = await load_bundles({
        ticker: parameters.ticker,
        only_for_sale: true
    });

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New sales info request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    logger.info(`New sales info request ... SUCCESS`);
    return show_sales_info(bundles_to_table(parameters.bundles));
}
