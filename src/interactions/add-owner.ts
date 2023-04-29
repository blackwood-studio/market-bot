import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger, projects } from '../static';
import { show_success } from '../embeds/show-success';
import { does_project_not_exists, is_not_owner_of_project, is_target_bot, is_target_source, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { Parameters } from '../general/parameters';
import { load_project } from '../general/load-project';

export async function add_owner(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.target = await load_user(interaction.options.getUser('target'));
    parameters.ticker = interaction.options.getString('ticker');
    parameters.project = await load_project(parameters.source, parameters.ticker);

    if (is_target_bot(parameters.target)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            ErrorCode.IS_BOT,
            parameters
        );
    }

    if (is_target_source(parameters.target, parameters.source)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            ErrorCode.TARGET_IS_SOURCE,
            parameters
        );
    }

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (await is_not_owner_of_project(parameters.source, parameters.ticker)) {
        logger.error(`New add owner request ... FAILED`);
        return show_error(
            ErrorCode.NOT_OWNER_OF_PROJECT,
            parameters
        );
    }

    parameters.project.owners_credentials[parameters.target.id] = parameters.target.credentials;
    await projects.set(parameters.ticker, parameters.project);

    logger.info(`New add owner request ... SUCCESS`);
    return show_success(`Owner has successfully been added`);
}
