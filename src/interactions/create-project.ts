import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { bundles, logger, projects } from '../static';
import { load_user } from '../general/load-user';
import { show_success } from '../embeds/show-success';
import { does_project_exists, is_ticker_invalid } from '../general/validator';
import { ErrorCode, show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { Parameters } from '../general/parameters';
import { load_project } from '../general/load-project';

export async function create_project(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const parameters: Parameters = {}

    parameters.source = await load_user(interaction.user);
    parameters.ticker = interaction.options.getString('ticker');
    parameters.source_bundle = await load_bundle(parameters.source, parameters.ticker);
    parameters.project = await load_project(parameters.source, parameters.ticker);

    if (is_ticker_invalid(parameters.ticker)) {
        logger.error(`New add items request ... FAILED`);
        return show_error(
            ErrorCode.INVALID_TICKER,
            parameters
        );
    }

    if (await does_project_exists(parameters.ticker)) {
        logger.error(`New create project request ... FAILED`);
        return show_error(
            ErrorCode.PROJECT_EXISTS,
            parameters
        );
    }

    parameters.source_bundle.items_amount = Number(process.env.START_ITEMS_AMOUNT);

    await projects.set(parameters.ticker, parameters.project);
    await bundles.set(`${parameters.source.id}::${parameters.ticker}`, parameters.source_bundle);

    logger.info(`New create project request ... SUCCESS`);
    return show_success(`Project has successfully been created`);
}
