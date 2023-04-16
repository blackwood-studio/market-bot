import { Entity, Repository } from "redis-om";

export abstract class CustomMap<K, E extends Entity> {
    protected repository: Repository<E>;

    public abstract get(key: K): Promise<E>

    public abstract set(key: K, entity: E): Promise<E>

    public abstract delete(key: K): Promise<boolean>

    public abstract for_each(callback: (value: E, index: number, array: E[]) => void): Promise<void>

    public abstract as_array(): Promise<Array<E>>
}
