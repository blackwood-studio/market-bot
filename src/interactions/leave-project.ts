import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user.js';
import { logger, projects } from '../static.js';
import { show_success } from '../embeds/show-success.js';
import { does_not_project_exists, is_not_owner_of_project } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';
import { load_project } from '../general/load-project.js';

export async function leave_project(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const project = await load_project(user, ticker);

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
