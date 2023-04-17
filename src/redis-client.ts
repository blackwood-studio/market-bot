import { CustomMap } from "./custom/custom-map.js";
import { client } from "./static.js";

export class RedisClient<K, V> {
    constructor(
        private collection_name: string
    ) {
    }

    // https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
    // maybe create custom map or use array or store in redis database

    private map_to_object(value: any): any {
        if(value instanceof CustomMap) {
            return {
              dataType: 'Map',
              value: Array.from(value.entries())
            };
        } else {
            return value;
        }
    }

    private object_to_map(value: any): any {
        if(typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
              return new Map(value.value);
            }
        }
        return value;
    }

    public async get(key: K): Promise<V> {
        return JSON.parse(await client.get(`${this.collection_name}::values::${key}`)) as V;
    }

    public async set(key: K, value: V): Promise<V> {
        await client.set(`${this.collection_name}::values::${key}`, JSON.stringify(value));
        return value;
    }

    public async delete(key: K): Promise<boolean> {
        const status = await client.del(`${this.collection_name}::values::${key}`);
        return status === 0 ? true : false;
    }

    public async as_array(): Promise<V[]> {
        const full_keys = await client.keys(`*${this.collection_name}::values::*`) as K[];
        const values: V[] = [];

        for (let i = 0; i < full_keys.length; i++) {
            const value = JSON.parse(await client.get(`${full_keys[i]}`)) as V;
            values.push(value);
        }

        return values;
    }

    public async for_each(callback: (value: V) => void): Promise<void> {
        const values = await this.as_array();
        values.forEach(callback);
    }
}
