import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user.js';
import { logger } from '../static.js';
import { show_error } from '../embeds/show-error.js';
import { show_user_info } from '../embeds/show-user-info.js';
import { is_user_bot } from '../general/validator.js';
import { bundles_to_table } from '../tables/bundles-table.js';
import { load_bundles } from '../general/load-bundle.js';

export function user_info(interaction: ChatInputCommandInteraction): EmbedBuilder {
    const target = load_user(interaction.options.getUser('target'));
    const bundles = load_bundles({ owner_id: target.id });

    if (is_user_bot(target)) {
        logger.error(`New user info request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Option 'target' can only be a real user`
        );
    }

    logger.info(`New user info request ... SUCCESS`);
    return show_user_info(target, bundles_to_table(bundles));
}
