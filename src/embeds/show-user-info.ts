import { EmbedBuilder } from 'discord.js';
import { CustomUser } from '../custom/custom-user.js';
import { BundleTables } from '../tables/bundles-table.js';

export function show_user_info(user: CustomUser, bundles_table: BundleTables): EmbedBuilder {
    return new EmbedBuilder()
    .setColor(0xa1a2a9)
    .addFields(
        { 
            name: `\u000A`, 
            value: `\u000A` 
        },
        { 
            name: `🏷️ Name`,
            value: `${user.username}`, 
            inline: true 
        },
        { 
            name: `💵 Money`, 
            value: `${user.money_amount.toFixed(2)}$`, 
            inline: true 
        },
        { 
            name: `\u000A`, 
            value: `\u000A` 
        },
        { 
            name: `🔑 Ticker `,
            value: `=─=─=─=─=─=─=─=─=─=─=─=─=─=─=─=${bundles_table.tickers}`, 
            inline: true 
        },
        { 
            name: `📜 Amount of items`, 
            value: `=─=─=─=─=─=─=─=─=─=─=─=─=─=─=─=${bundles_table.items_amounts}`, 
            inline: true 
        },
        { 
            name: `\u000A`, 
            value: `\u000A` 
        }
    );
}
