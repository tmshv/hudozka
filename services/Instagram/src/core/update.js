import {collection} from './db';
import {api} from '../instagram';
import {postFromInstagramMedia} from '../models/post';
import Service from '../api/Service';
import {serviceSecret} from '../config';

const service = new Service(serviceSecret);

var instagramClient;

export default async function update(id, data) {
    const updateTimestamp = data.time;
    const instagram = await client();
    try {
        let data = await instagram.user.mediaRecent(null, 1, updateTimestamp);
        let items = data.medias.map(postFromInstagramMedia);

        for (i of items) {
            await service.feed.add(i);
        }
    } catch (e) {
        console.log(e);
    }
}

async function client() {
    if (instagramClient) return instagramClient;

    const provider = 'instagram';
    const users = collection('users');

    let profile = await users.findOne({
        provider: provider
    });

    if (profile) {
        instagramClient = api(profile.accessToken);
        return instagramClient;
    }
    return null;
}
