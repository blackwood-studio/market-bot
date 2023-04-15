import { EmbedBuilder } from 'discord.js';
import { BundleTables } from '../tables/bundles-table';
import { ProjectTable } from '../tables/project-table';

export function show_projects_overview(project_table: ProjectTable): EmbedBuilder {
    return new EmbedBuilder()
    .setColor(0xa1a2a9)
    .addFields(
        { 
            name: `\u000A`, 
            value: `\u000A` 
        },
        { 
            name: `🔑 Ticker `,
            value: `=─=─=─=─=─=─=─=─=─=─=─=─=─=─=─=${project_table.tickers}`, 
            inline: true 
        },
        { 
            name: `👤 Owner`, 
            value: `=─=─=─=─=─=─=─=─=─=─=─=─=─=─=─=${project_table.owners_usernames}`, 
            inline: true 
        },
        { 
            name: `\u000A`, 
            value: `\u000A` 
        }
    );
}
