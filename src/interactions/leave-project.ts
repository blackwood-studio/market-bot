import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { bundle_market, logger } from '../static';
import { show_success } from '../embeds/show-success';
import { does_not_project_exists, is_not_owner_of_project, is_source_target, is_ticker_invalid, is_user_bot } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { load_project } from '../general/load-project';

export async function leave_project(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const project = await load_project(user, ticker);

    if (is_ticker_invalid(ticker)) {
        logger.error(`New leave project request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (await does_not_project_exists(ticker)) {
        logger.error(`New leave project request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (await is_not_owner_of_project(user, ticker)) {
        logger.error(`New leave project request ... FAILED`);
        return show_error(
            `Missing owner rights`,
            `User '${user.username}' is not owner of '${ticker}'`
        );
    }

    project.owners_credentials[user.id] = undefined;
    await projects.set(ticker, project);

    logger.info(`New leave project request ... SUCCESS`);
    return show_success(`Owner has successfully been added`);
}
