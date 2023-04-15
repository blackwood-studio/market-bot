import { User } from 'discord.js';
import { users } from '../static';
import { Credentials } from '../interfaces/credentials';

export interface CustomUser extends User {
    money_amount: number,
    get_credentials: () => Credentials
}

export class CustomUserConstructor {
    public from(user: User): CustomUser {
        const custom_user = user as CustomUser;

        custom_user.money_amount = Number(process.env.START_CAPITAL);
        custom_user.get_credentials = () => {
            return {
                id: custom_user.id,
                username: custom_user.username,
            }
        }

        users.set(user.id, custom_user);

        return custom_user;
    }
}

export const CustomUser = new CustomUserConstructor();
