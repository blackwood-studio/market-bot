import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundle_market, logger } from '../static';
import { does_not_project_exists, has_not_enough_items, is_items_amount_invalid, is_money_amount_invalid, items_are_for_sale } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';

export function sell_items(interaction: ChatInputCommandInteraction): EmbedBuilder {
    const user = load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const items_amount = interaction.options.getInteger('items_amount');
    const price_per_item = interaction.options.getNumber('price_per_item');
    const user_bundle = load_bundle(user, ticker);

    if (is_items_amount_invalid(items_amount)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            `Option 'items_amount' is invalid`,
            `Option 'items_amount' cannot be negative or zero`
        );
    }

    if (is_money_amount_invalid(price_per_item)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            `Option 'price_per_item' is invalid`,
            `Option 'price_per_item' cannot be negative or zero`
        );
    }

    if (does_not_project_exists(ticker)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (items_are_for_sale(user_bundle)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            `Sale already exists`,
            `You need to cancel the sale of '${user_bundle.ticker}'`
        );
    }

    if (has_not_enough_items(user_bundle, items_amount)) {
        logger.error(`New sell items request ... FAILED`);
        return show_error(
            `Not enough items`,
            `User '${user.username}' is ${items_amount - (user_bundle.items_amount - user_bundle.items_amount_for_sale)} items short`
        );
    }

    user_bundle.items_amount_for_sale = items_amount;
    user_bundle.price_per_item = price_per_item;
    
    bundle_market.bundles.set(`${user.id}::${ticker}`, user_bundle);

    logger.info(`New sell items request ... SUCCESS`);
    return show_success(`Sale has successfully been posted`);
}
