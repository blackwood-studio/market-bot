import { User } from 'discord.js';
import { CustomUser } from '../custom/custom-user.js';
import { users } from '../static.js';

export function load_user(user: User): CustomUser {
    return users.get(user.id) || CustomUser.from(user);
}
