import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user.js';
import { bundles, logger } from '../static.js';
import { load_bundle } from '../general/load-bundle.js';
import { show_success } from '../embeds/show-success.js';
import { does_not_project_exists, is_items_amount_invalid, is_not_owner_of_project, is_ticker_invalid } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';

export async function add_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const items_amount = interaction.options.getInteger('items_amount');
    const user_bundle = await load_bundle(user, ticker);

    if (is_ticker_invalid(ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (is_items_amount_invalid(items_amount)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            `Option 'sellable_items_amount' is invalid`,
            `Option 'sellable_items_amount' cannot be negative or zero`
        );
    }

    if (await does_not_project_exists(ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (await is_not_owner_of_project(user, ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            `Missing owner rights`,
            `User '${user.username}' is not owner of '${ticker}'`
        );
    }

    user_bundle.items_amount += items_amount;
    await bundles.set(`${user.id}::${ticker}`, user_bundle);

    logger.info(`New add items request ... SUCCESS`);
    return show_success(`Amout of items has successfully been increased`);
}
