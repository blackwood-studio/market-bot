import { EmbedBuilder } from 'discord.js';
import { BundleTables } from '../tables/bundles-table';

export function show_sales_info(bundles_table: BundleTables): EmbedBuilder {
    return new EmbedBuilder()
    .setColor(0xa1a2a9)
    .addFields(
        { 
            name: `\u000A`, 
            value: `\u000A` 
        },
        { 
            name: `👤 Owner`, 
            value: `=─=─=─=─=─=─=─=─=─=─=${bundles_table.owner_usernames}`, 
            inline: true 
        },
        { 
            name: `💵 Price per item`, 
            value: `=─=─=─=─=─=─=─=─=─=─=${bundles_table.price_per_items}`, 
            inline: true 
        },
        { 
            name: `📜 Amount of items`, 
            value: `=─=─=─=─=─=─=─=─=─=─=${bundles_table.items_amount_for_sales}`, 
            inline: true 
        },
        { 
            name: `\u000A`, 
            value: `\u000A` 
        }
    );
}
