import { EmbedBuilder } from 'discord.js';

export function show_error(description: string, tip: string): EmbedBuilder {
    return new EmbedBuilder()
    .setColor(0xe33900)
    .addFields(
        { 
            name: `❌ Error `, 
            value: `${description}` 
        },
        { 
            name: `💡 Tip`, 
            value: `${tip}` 
        }
    );
}
