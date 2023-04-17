import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user.js';
import { bundles, logger } from '../static.js';
import { does_not_project_exists, has_not_enough_items, is_items_amount_invalid, is_source_target, is_user_bot } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';
import { load_bundle } from '../general/load-bundle.js';
import { show_success } from '../embeds/show-success.js';

export async function send_items(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const source = await load_user(interaction.user);
    const target = await load_user(interaction.options.getUser('target'));
    const ticker = interaction.options.getString('ticker');
    const items_amount = interaction.options.getInteger('items_amount');
    const source_bundle = await load_bundle(source, ticker);
    const target_bundle = await load_bundle(target, ticker);

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

    await bundles.set(`${source.id}::${ticker}`, source_bundle);
    await bundles.set(`${target.id}::${ticker}`, target_bundle);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Items has successfully been sent`);
}
