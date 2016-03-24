import {collection} from './db';
import {jwtSecret} from '../config';
import {sign} from 'jsonwebtoken';

/**
 * {
 *      username: String,
 *      bio: String,
 *      website: String,
 *      profile_picture: String,
 *      full_name: String,
 *      id: String
 * }
 *
 * @param accessToken
 * @param user
 */
export async function authorizeUser(accessToken, user) {
    const provider = 'instagram';
    const users = collection('users');

    let profile = await users.findOne({
        provider: provider,
        username: user.username
    });

    if(profile){
        Object.keys(user).forEach(i => {
            profile[i] = user[i];
        });
        profile.accessToken = accessToken;
        profile.jwtToken = await createToken(profile);

        await users.update({_id: profile['_id']}, profile);
        return profile;
    }else{
        return null;
    }
}

async function createToken(user){
    return new Promise((resolve, reject) => {
        sign(user, jwtSecret, {}, token => {
            if (!token) return reject();
            resolve(token);
        });
    });
}
