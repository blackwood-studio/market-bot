import { Repository } from "redis-om";
import { client } from "../../static.js";
import { project_schema } from "../../schemas/project-schema.js";
import { Project } from "../../entities/project.js";
import { CustomMap } from "../custom-map.js";

export class ProjectMap extends CustomMap<string, Project> {
    constructor() {
        super();
        this.repository = client.fetchRepository(project_schema);
    }

    public async get(key: string): Promise<Project> {
        return await this.repository.search().
        where('ticker').equals(key)
        .return.first();
    }

    public async set(key: string, entity: Project): Promise<Project> {
        const id = await this.repository.save(entity);
        return this.repository.fetch(id);
    }

    public async delete(key: string): Promise<boolean> {
        const entity = await this.get(key);
        this.repository.remove(entity.entityId);
        return Boolean(await client.execute([`SEARCH`, `Project:${entity.entityId}`]));
    }

    public async for_each(callback: (value: Project, index: number, array: Project[]) => void): Promise<void> {
        const entities = await this.repository.search().return.all();
        entities.forEach(callback);
    }

    public async as_array(): Promise<Project[]> {
        return await this.repository.search().return.all();
    }
}