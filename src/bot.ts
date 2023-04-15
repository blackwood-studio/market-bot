import { 
    ChatInputCommandInteraction, 
    Client, 
    EmbedBuilder, 
    Events, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    SlashCommandIntegerOption, 
    SlashCommandNumberOption, 
    SlashCommandStringOption, 
    SlashCommandUserOption 
} from 'discord.js';

import { logger, market } from './static';
import { user_info } from './interactions/user-info';
import { send_money } from './interactions/send-money';
import { send_items } from './interactions/send-items';
import { buy_items } from './interactions/buy-items';
import { sell_items } from './interactions/sell-items';
import { sales_info } from './interactions/sales-info';
import { cancel_sale } from './interactions/cancel-sale';
import { add_items } from './interactions/add-items';
import { project_overview } from './interactions/project-overview';
import { create_project } from './interactions/create-project';
import { add_owner } from './interactions/add-owner';
import { leave_project } from './interactions/leave-project';

const commands = [
    new SlashCommandBuilder()
    .setName(`user_info`)
    .setDescription(`Shows you more infromation about 'target'`)
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName(`target`)
            .setDescription(`Choose the 'target'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`sales_info`)
    .setDescription(`Shows you more infromation about 'ticker'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`project_overview`)
    .setDescription(`Shows you all existing projects`),

    new SlashCommandBuilder()
    .setName(`create_project`)
    .setDescription(`Create project 'ticker'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`add_owner`)
    .setDescription(`Add 'target' as owner to 'ticker'`)
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName(`target`)
            .setDescription(`Choose the 'target'`)
            .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`leave_project`)
    .setDescription(`Leave project 'ticker'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`send_money`)
    .setDescription(`Sends the 'money_amount' to 'target'`)
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName(`target`)
            .setDescription(`Choose the 'target'`)
            .setRequired(true))
    .addNumberOption((option: SlashCommandNumberOption) => 
        option.setName(`money_amount`)
            .setDescription(`Choose the 'money_amount'`)
            .setRequired(true)),


    new SlashCommandBuilder()
    .setName(`send_items`)
    .setDescription(`Sends the 'items_amount' to 'target'`)
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName(`target`)
            .setDescription(`Choose the 'target'`)
            .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true))
    .addIntegerOption((option: SlashCommandIntegerOption) => 
        option.setName(`items_amount`)
            .setDescription(`Choose the 'items_amount'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`sell_items`)
    .setDescription(`Sell the 'items_amount' of 'ticker'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true))
    .addIntegerOption((option: SlashCommandIntegerOption) => 
        option.setName(`items_amount`)
            .setDescription(`Choose the 'items_amount'`)
            .setRequired(true))
    .addNumberOption((option: SlashCommandNumberOption) => 
    option.setName(`price_per_item`)
        .setDescription(`Choose the 'price_per_item'`)
        .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`cancel_sale`)
    .setDescription(`Cancel the sale of 'ticker'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`buy_items`)
    .setDescription(`Buy the 'items_amount' of 'ticker'`)
    .addUserOption((option: SlashCommandUserOption) => 
        option.setName(`target`)
            .setDescription(`Choose the 'target'`)
            .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true)),

    new SlashCommandBuilder()
    .setName(`add_items`)
    .setDescription(`Increase 'ticker' by 'items_amount'`)
    .addStringOption((option: SlashCommandStringOption) => 
        option.setName(`ticker`)
            .setDescription(`Choose the 'ticker'`)
            .setRequired(true))
    .addIntegerOption((option: SlashCommandIntegerOption) => 
        option.setName(`items_amount`)
            .setDescription(`Choose the 'items_amount'`)
            .setRequired(true))
];

export class Bot {
    
    private client: Client;

    constructor(
        private token: string, 
        private client_id: string
    ){
        this.client = new Client({ intents: [ GatewayIntentBits.Guilds ] });
    }

    public set_commands(): void {
        logger.info(`Started refreshing bot commands`);
        
        const rest = new REST({ version: '10' }).setToken(this.token);

        rest.put(
            Routes.applicationCommands(this.client_id), { body: commands }
        )
        .then(_ => {
            logger.info(`Refreshing bot commands was successful`);
        })
        .catch(_ => {
            logger.error(`Refreshing bot commands has failed`);
        })
    }

    private handle_interaction(interaction: ChatInputCommandInteraction): EmbedBuilder {
        switch (interaction.commandName) {
            case 'user_info':
                return user_info(interaction);
            case 'sales_info':
                return sales_info(interaction);
            case 'project_overview':
                return project_overview();
            case 'create_project':
                return create_project(interaction);
            case 'add_owner':
                return add_owner(interaction);
            case 'leave_project':
                return leave_project(interaction);
            case 'send_money':
                return send_money(interaction);
            case 'send_items':
                return send_items(interaction);
            case 'sell_items':
                return sell_items(interaction);
            case 'cancel_sale':
                return cancel_sale(interaction);
            case 'buy_items':
                return buy_items(interaction);
            case 'add_items':
                return add_items(interaction);
        }
    }

    public start(): void {
        logger.info(`Started bot lifecycle`);

        this.client.once(Events.ClientReady, (client: Client) => {
            logger.info(`Bot logged in as '${client.user.tag}'`);
            market.start();
        });

        this.client.on(Events.InteractionCreate, (interaction: ChatInputCommandInteraction) => {
            interaction.reply({
                embeds: [ this.handle_interaction(interaction) ]
            });
        });
        
        this.client.login(this.token);
    }
}
