import { client } from "./static";

export class RedisClient<V> {
    constructor(
        private collection_name: string
    ) {
    }

    public async get(key: string): Promise<V> {
        return JSON.parse(await client.get(`${this.collection_name}::values::${key}`)) as V;
    }

    public async set(key: string, value: V): Promise<V> {
        await client.set(`${this.collection_name}::values::${key}`, JSON.stringify(value));
        return value;
    }

    public async delete(key: string): Promise<boolean> {
        const status = await client.del(`${this.collection_name}::values::${key}`);
        return status === 0 ? true : false;
    }

    public async as_array(): Promise<V[]> {
        const keys = await client.keys(`*${this.collection_name}::values::*`) as string[]
        return await Promise.all(
            keys.map(async (key: string) => {
                return JSON.parse(await client.get(`${key}`)) as V;
            })
        );
    }

    public async for_each(callback: (value: V) => void): Promise<void> {
        const values = await this.as_array();
        values.forEach(callback);
    }
}
