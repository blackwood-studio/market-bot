import { EmbedBuilder } from 'discord.js';
import { logger, projects } from '../static';
import { show_projects_overview } from '../embeds/show-projects-overview';
import { projects_to_table } from '../tables/project-table';

export async function project_overview(): Promise<EmbedBuilder> {
    logger.info(`New projects info request ... SUCCESS`);
    return show_projects_overview(projects_to_table(await projects.as_array()));
}
