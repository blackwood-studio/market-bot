export class CustomMap<K, V> extends Map<K, V> {
    public as_array(): Array<V> {
        return Array.from(this.values());
    }
}
