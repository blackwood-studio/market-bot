import * as dotenv from 'dotenv';
import { Logger } from 'tslog';
import { CustomMap } from './custom/custom-map';
import { CustomUser } from './custom/custom-user';
import { BundleMarket } from './bundle-market';
import { Market } from './market';

export const logger = new Logger({
    prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t{{name}}'
});

export const users: CustomMap<string, CustomUser> = new CustomMap();
export const bundle_market = new BundleMarket();
export const market: Market = new Market();
