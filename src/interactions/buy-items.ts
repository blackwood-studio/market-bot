import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundle_market, logger, users } from '../static';
import { does_not_project_exists, has_not_enough_money, is_source_target, is_ticker_invalid, is_user_bot, items_are_not_for_sale } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { show_success } from '../embeds/show-success';
import { load_bundle } from '../general/load-bundle';
import { round_number } from '../general/round';

export function buy_items(interaction: ChatInputCommandInteraction): EmbedBuilder {
    const source = load_user(interaction.user);
    const target = load_user(interaction.options.getUser('target'));
    const ticker = interaction.options.getString('ticker');
    const source_bundle = load_bundle(source, ticker);
    const target_bundle = load_bundle(target, ticker);
    const price = round_number(target_bundle.price_per_item * target_bundle.items_amount_for_sale);

    if (is_ticker_invalid(ticker)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (is_user_bot(target)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Option 'target' can only be a real user`
        );
    }

    if (is_source_target(source, target)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Cannot choose yourself as 'target'`
        );
    }

    if (does_not_project_exists(ticker)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (has_not_enough_money(source, price)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Not enough money`,
            `User '${source.username}' is ${(price - source.money_amount).toFixed(2)}$ short`
        );
    }

    if (items_are_not_for_sale(target_bundle)) {
        logger.error(`New buy item request ... FAILED`);
        return show_error(
            `Items are not for sale`,
            `User '${target.username}' does not sell '${target_bundle.ticker}'`
        );
    }

    source_bundle.items_amount += target_bundle.items_amount_for_sale;
    target_bundle.items_amount -= target_bundle.items_amount_for_sale;
    
    source.money_amount = round_number(source.money_amount - price);
    target.money_amount = round_number(target.money_amount + price);

    target_bundle.items_amount_for_sale = 0;

    bundle_market.bundles.set(`${source.id}::${ticker}`, source_bundle);
    bundle_market.bundles.set(`${target.id}::${ticker}`, target_bundle);

    users.set(source.id, source);
    users.set(target.id, target);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Purchase was successful`);
}
