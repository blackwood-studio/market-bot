import { User } from 'discord.js';
import { CustomUser } from '../custom/custom-user';
import { users } from '../static';

export async function load_user(user: User): Promise<CustomUser> {
    return await users.get(user.id) || CustomUser.from(user);
}
