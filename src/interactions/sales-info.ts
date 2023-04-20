import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { logger } from '../static.js';
import { bundles_to_table } from '../tables/bundles-table.js';
import { load_bundles } from '../general/load-bundle.js';
import { show_sales_info } from '../embeds/show-sales-info.js';
import { does_not_project_exists, is_ticker_invalid } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';

export async function sales_info(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const ticker = interaction.options.getString('ticker');
    const bundles = await load_bundles({ 
        ticker, 
        only_for_sale: true 
    });

    if (is_ticker_invalid(ticker)) {
        logger.error(`New sales info request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (await does_not_project_exists(ticker)) {
        logger.error(`New sales info request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    logger.info(`New sales info request ... SUCCESS`);
    return show_sales_info(bundles_to_table(bundles));
}
