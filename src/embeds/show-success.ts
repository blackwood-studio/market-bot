import { EmbedBuilder } from 'discord.js';

export function show_success(description: string): EmbedBuilder {
    return new EmbedBuilder()
    .setColor(0x069869)
    .addFields(
        { 
            name: `✅ Success `, 
            value: `${description}` 
        }
    );
}
