import { EmbedBuilder } from 'discord.js';
import { bundle_market, logger } from '../static';
import { show_projects_overview } from '../embeds/show-projects-overview';
import { projects_to_table } from '../tables/project-table';

export function project_overview(): EmbedBuilder {
    logger.info(`New projects info request ... SUCCESS`);
    return show_projects_overview(projects_to_table(bundle_market.projects.as_array()));
}
