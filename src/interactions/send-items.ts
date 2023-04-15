import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundle_market, logger } from '../static';
import { does_not_project_exists, has_not_enough_items, is_items_amount_invalid, is_source_target, is_ticker_invalid, is_user_bot } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { show_success } from '../embeds/show-success';

export function send_items(interaction: ChatInputCommandInteraction): EmbedBuilder {
    const source = load_user(interaction.user);
    const target = load_user(interaction.options.getUser('target'));
    const ticker = interaction.options.getString('ticker');
    const items_amount = interaction.options.getInteger('items_amount');
    const source_bundle = load_bundle(source, ticker);
    const target_bundle = load_bundle(target, ticker);

    if (is_user_bot(target)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Option 'target' can only be a real user`
        );
    }

    if (is_source_target(source, target)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Cannot choose yourself as 'target'`
        );
    }

    if (is_ticker_invalid(ticker)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (is_items_amount_invalid(items_amount)) {
        logger.error(`New send item request ... FAILED`);
        return show_error(
            `Option 'items_amount' is invalid`,
            `Option 'items_amount' cannot be negative or zero`
        );
    }

    if (does_not_project_exists(ticker)) {
        logger.error(`New send items request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (has_not_enough_items(source_bundle, items_amount)) {
        logger.error(`New send items request ... FAILED`);
        return show_error(
            `Not enough items`,
            `User '${source.username}' is ${items_amount - (source_bundle.items_amount - source_bundle.items_amount_for_sale)} items short`
        );
    }

    source_bundle.items_amount -= items_amount;
    target_bundle.items_amount += items_amount;

    bundle_market.bundles.set(`${source.id}::${ticker}`, source_bundle);
    bundle_market.bundles.set(`${target.id}::${ticker}`, target_bundle);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Items has successfully been sent`);
}
