import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { bundle_market, logger } from '../static';
import { load_user } from '../general/load-user';
import { show_success } from '../embeds/show-success';
import { does_project_exists } from '../general/validator';
import { show_error } from '../embeds/show-error';
import { load_bundle } from '../general/load-bundle';
import { load_project } from '../general/load-project';

export function create_project(interaction: ChatInputCommandInteraction): EmbedBuilder {
    const user = load_user(interaction.user);
    const ticker = interaction.options.getString('ticker');
    const user_bundle = load_bundle(user, ticker);
    const project = load_project(user, ticker);

    if (does_project_exists(ticker)) {
        logger.error(`New create project request ... FAILED`);
        return show_error(
            `Project already exists`,
            `Project '${ticker}' already exists`
        );
    }

    user_bundle.items_amount = Number(process.env.START_ITEMS_AMOUNT);

    bundle_market.projects.set(ticker, project);
    bundle_market.bundles.set(`${user.id}::${ticker}`, user_bundle);

    logger.info(`New create project request ... SUCCESS`);
    return show_success(`Project has successfully been created`);
}
