import { User } from 'discord.js';
import { CustomUser } from '../custom/custom-user.js';
import { users } from '../static.js';

export async function load_user(user: User): Promise<CustomUser> {
    return await users.get(user.id) || CustomUser.from(user);
}
