import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger, users } from '../static';
import { has_not_enough_money, is_money_amount_invalid, is_target_bot, is_target_source } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { round_number } from '../general/round';
import { show_success } from '../embeds/show-success';
import { Parameters } from '../general/parameters';

export async function send_money(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.target = await load_user(interaction.options.getUser('target'));
    parameters.money_amount = interaction.options.getNumber('money_amount')

    if (is_target_bot(parameters.target)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            ErrorCode.IS_BOT,
            parameters
        );
    }

    if (is_target_source(parameters.source, parameters.target)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            ErrorCode.TARGET_IS_SOURCE,
            parameters
        );
    }

    if (is_money_amount_invalid(parameters.money_amount)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_MONEY_AMOUNT,
            parameters
        );
    }

    if (has_not_enough_money(parameters.source, parameters.money_amount)) {
        logger.error(`New send money request ... FAILED`);
        return show_error(
            ErrorCode.HAS_NOT_ENOUGH_MONEY,
            parameters
        );
    }

    parameters.source.money_amount = round_number(parameters.source.money_amount - parameters.money_amount);
    parameters.target.money_amount = round_number(parameters.target.money_amount + parameters.money_amount);

    await users.set(parameters.source.id, parameters.source);
    await users.set(parameters.target.id, parameters.target);

    logger.info(`New send money request ... SUCCESS`);
    return show_success(`Money has successfully been sent`);
}
