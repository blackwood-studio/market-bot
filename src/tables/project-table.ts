import { Credentials } from '../interfaces/credentials';
import { Project } from '../interfaces/project';

export interface ProjectTable {
    tickers: string,
    owners_usernames: string,
}

export function projects_to_table(projects: Project[]): ProjectTable {
    const project_table: ProjectTable = {
        tickers: '',
        owners_usernames: '',
    }

    projects.sort((a: Project, b: Project) => {
        return a.ticker > b.ticker ? 1 : -1;
    })

    projects.forEach((project: Project) => {
        const owners_usernames = Object.values(project.owners_credentials)
        .map((credentials: Credentials) => credentials.username).toString();
        
        project_table.tickers += `\`\`\` ${project.ticker} \`\`\``;
        project_table.owners_usernames += `\`\`\` ${owners_usernames} \`\`\``;
    });

    return project_table;
}
