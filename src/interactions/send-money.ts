import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger, users } from '../static';
import { has_not_enough_money, is_money_amount_invalid, is_source_target, is_user_bot } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { round_number } from '../general/round';
import { show_success } from '../embeds/show-success';

export async function send_money(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const source = await load_user(interaction.user);
    const target = await load_user(interaction.options.getUser('target'));
    const money_amount = interaction.options.getNumber('money_amount');

    if (is_user_bot(target)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Option 'target' can only be a real user`
        );
    }

    if (is_source_target(source, target)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Cannot choose yourself as 'target'`
        );
    }

    if (is_money_amount_invalid(money_amount)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            `Option 'money_amount' is invalid`,
            `Option 'money_amount' cannot be negative or zero`
        );
    }

    if (has_not_enough_money(source, money_amount)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            `Not enough money`,
            `User '${source.username}' is ${(money_amount - source.money_amount).toFixed(2)}$ short`
        );
    }

    source.money_amount = round_number(source.money_amount - money_amount);
    target.money_amount = round_number(target.money_amount + money_amount);

    await users.set(source.id, source);
    await users.set(target.id, target);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Money has successfully been sent`);
}
