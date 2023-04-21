import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundles, logger } from '../static';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';
import { does_not_project_exists, is_ticker_invalid, items_are_not_for_sale } from '../general/validator';
import { show_error } from '../embeds/show-error';

export async function cancel_sale(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const user_bundle = await load_bundle(user, ticker);

    if (is_ticker_invalid(ticker)) {
        logger.error(`New cancel sale request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (await does_not_project_exists(ticker)) {
        logger.error(`New cancel sale request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (items_are_not_for_sale(user_bundle)) {
        logger.error(`New cancel sale request ... FAILED`);
        return show_error(
            `Items are not for sale`,
            `User '${user.username}' does not sell '${user_bundle.ticker}'`
        );
    }

    user_bundle.items_amount_for_sale = 0;
    user_bundle.price_per_item = 0.00;
    await bundles.set(`${user.id}::${ticker}`, user_bundle);

    logger.info(`New cancel sale request ... SUCCESS`);
    return show_success(`Sale has successfully been canceled`);
}
