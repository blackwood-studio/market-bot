import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger, projects } from '../static';
import { show_success } from '../embeds/show-success';
import { does_not_project_exists, is_not_owner_of_project, is_source_target, is_ticker_invalid, is_user_bot } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { load_project } from '../general/load-project';

export async function add_owner(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const source = await load_user(interaction.user);
    const target = await load_user(interaction.options.getUser('target'));
    const ticker = interaction.options.getString('ticker');
    const project = await load_project(source, ticker);

    if (is_ticker_invalid(ticker)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            `Option 'ticker' is invalid`,
            `Option 'ticker' must follow the pattern A-Z, 0-9 and .`
        );
    }

    if (is_user_bot(target)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Option 'target' can only be a real user`
        );
    }

    if (is_source_target(source, target)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            `Option 'target' is invalid`,
            `Cannot choose yourself as 'target'`
        );
    }

    if (await does_not_project_exists(ticker)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            `Project does not exists`,
            `Project '${ticker}' could not be found`
        );
    }

    if (await is_not_owner_of_project(source, ticker)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            `Missing owner rights`,
            `User '${source.username}' is not owner of '${ticker}'`
        );
    }

    project.owners_credentials[target.id] = target.credentials;
    await projects.set(ticker, project);

    logger.info(`New add owner request ... SUCCESS`);
    return show_success(`Owner has successfully been added`);
}
