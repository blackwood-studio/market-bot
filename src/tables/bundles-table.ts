import { Bundle } from '../interfaces/bundle.js';

export interface BundleTables {
    tickers: string,
    owner_usernames: string,
    items_amounts: string,
    price_per_items: string,
    items_amount_for_sales: string
}

export function bundles_to_table(bundles: Bundle[]): BundleTables {
    const bundle_table: BundleTables = {
        tickers: '',
        owner_usernames: '',
        items_amounts: '',
        price_per_items: '',
        items_amount_for_sales: ''
    }

    bundles.sort((a: Bundle, b: Bundle) => {
        return a.price_per_item > b.price_per_item ? 1 : -1;
    })

    bundles.forEach((bundle: Bundle) => {
        bundle_table.tickers += `\`\`\` ${bundle.ticker} \`\`\``;
        bundle_table.owner_usernames += `\`\`\` ${bundle.owner_credentials.username} \`\`\``;
        bundle_table.items_amounts += `\`\`\` ${bundle.items_amount} \`\`\``;
        bundle_table.price_per_items += `\`\`\` ${bundle.price_per_item.toFixed(2)}$ \`\`\``;
        bundle_table.items_amount_for_sales += `\`\`\` ${bundle.items_amount_for_sale} \`\`\``;
    });

    return bundle_table;
}
