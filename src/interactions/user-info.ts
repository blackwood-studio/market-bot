import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger } from '../static';
import { ErrorCode, show_error } from '../embeds/show-error';
import { show_user_info } from '../embeds/show-user-info';
import { is_target_bot } from '../general/validator';
import { bundles_to_table } from '../tables/bundles-table';
import { load_bundles } from '../general/load-bundle';
import { Parameters } from '../general/parameters';

export async function user_info(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.target = await load_user(interaction.options.getUser('target'));
    parameters.bundles = await load_bundles({ owner_id: parameters.target.id });

    if (is_target_bot(parameters.target)) {
        logger.error(`New user info request ... FAILED`);
        return show_error(
            ErrorCode.IS_BOT,
            parameters
        );
    }

    logger.info(`New user info request ... SUCCESS`);
    return show_user_info(parameters.target, bundles_to_table(parameters.bundles));
}
