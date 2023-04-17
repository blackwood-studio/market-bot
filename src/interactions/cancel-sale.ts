import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user.js';
import { bundles, logger } from '../static.js';
import { load_bundle } from '../general/load-bundle.js';
import { show_success } from '../embeds/show-success.js';
import { does_not_project_exists, items_are_not_for_sale } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';

export async function cancel_sale(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const user_bundle = await load_bundle(user, ticker);

    if (does_not_project_exists(ticker)) {
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
