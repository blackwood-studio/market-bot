import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { load_user } from '../general/load-user';
import { logger, projects } from '../static';
import { show_success } from '../embeds/show-success';
import { does_project_not_exists, is_not_owner_of_project, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { load_project } from '../general/load-project';
import { Parameters } from '../general/parameters';

export async function leave_project(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.ticker = interaction.options.getString('ticker');
    parameters.project = await load_project(parameters.source, parameters.ticker);

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_not_exists(parameters.ticker)) {
        logger.error(`New leave project request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_NOT_EXISTS,
            parameters
        );
    }

    if (await is_not_owner_of_project(parameters.source, parameters.ticker)) {
        logger.error(`New leave project request ... FAILED`);
        return show_error(
            ErrorCode.NOT_OWNER_OF_PROJECT,
            parameters
        );
    }

    parameters.project.owners_credentials[parameters.source.id] = undefined;
    await projects.set(parameters.ticker, parameters.project);

    logger.info(`New leave project request ... SUCCESS`);
    return show_success(`Owner has successfully been added`);
}
