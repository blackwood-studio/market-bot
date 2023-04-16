import { EmbedBuilder } from 'discord.js';
import { logger, projects } from '../static.js';
import { show_projects_overview } from '../embeds/show-projects-overview.js';
import { projects_to_table } from '../tables/project-table.js';

export function project_overview(): EmbedBuilder {
    logger.info(`New projects info request ... SUCCESS`);
    return show_projects_overview(projects_to_table(projects.as_array()));
}
