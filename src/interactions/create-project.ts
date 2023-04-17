import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { bundles, logger, projects } from '../static.js';
import { load_user } from '../general/load-user.js';
import { show_success } from '../embeds/show-success.js';
import { does_project_exists } from '../general/validator.js';
import { show_error } from '../embeds/show-error.js';
import { load_bundle } from '../general/load-bundle.js';
import { load_project } from '../general/load-project.js';

export async function create_project(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const user = await load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const user_bundle = await load_bundle(user, ticker);
    const project = await load_project(user, ticker);

    if (await does_project_exists(ticker)) {
        logger.error(`New create project request ... FAILED`);
        return show_error(
            `Project already exists`,
            `Project '${ticker}' already exists`
        );
    }

    user_bundle.items_amount = Number(process.env.START_ITEMS_AMOUNT);

    await projects.set(ticker, project);
    await bundles.set(`${user.id}::${ticker}`, user_bundle);

    logger.info(`New create project request ... SUCCESS`);
    return show_success(`Project has successfully been created`);
}
