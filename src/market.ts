import { CustomUser } from './custom/custom-user.js';
import { round_number } from './general/round.js';
import { logger, users } from './static.js';

export class Market {
    private switch_session(): void {
        users.for_each((user: CustomUser) => {
            user.money_amount = round_number(user.money_amount + Number(process.env.PAYOUT_AMOUNT));
            users.set(user.id, user);
        })
    }
    
    public start(): void {
        setInterval(() => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(process.env.MARKET_OPENING_IN_HOURS));
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(process.env.MARKET_CLOSING_IN_HOURS));

            if (now >= start && now <= end) {
                logger.info(`Session has been switched`);
                this.switch_session();
            }
    
        }, Number(process.env.SESSION_TIME_IN_MINUTES) * 60 * 1000);
    }
}