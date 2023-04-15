import { User } from 'discord.js';
import { CustomUser } from '../custom/custom-user';
import { users } from '../static';

export function load_user(user: User): CustomUser {
    return users.get(user.id) || CustomUser.from(user);
}
