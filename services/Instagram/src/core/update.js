import {collection} from './db';
import {api} from '../instagram';
import {postFromInstagramMedia} from '../models/post';
import Service from '../api/Service';
import {serviceHost, serviceName, serviceSecret, fetchItemsPerUpdateLoop as num} from '../config';

const service = new Service(serviceHost, serviceName, serviceSecret);

var instagramClient;

export default async function update(id, data) {
    const updateTimestamp = data.time;
    const instagram = await client();
    try {
        let data = await instagram.user.mediaRecent(null, 1, updateTimestamp);
        let items = data.medias.map(postFromInstagramMedia);

        return await Promise.all(
            items.map(post => service.feed.add(post))
        );
    } catch (e) {
        console.log(e);
    }
}

export async function clearSubscriptions(callbackUrl) {
    const instagram = await client();
    return await instagram.subscriptions.removeAll();
}

export async function updateSubscription(callbackUrl) {
    const instagram = await client();

    let data = await instagram.subscriptions.list();
    let activeSubscriptions = data.result;

    console.log(`Active subscriptions ${activeSubscriptions}`);

    let objectSubscriptions = activeSubscriptions.filter(i => i.object === 'user' && !i.object_id && i.callback_url === callbackUrl)
    
    if (!objectSubscriptions.length) {
        // {
        //     result: {
        //         object: 'tag',
        //         object_id: 'hello_lol',
        //         aspect: 'media',
        //         callback_url: 'http://dev.tmshv.ru/callback/hudozka',
        //         type: 'subscription',
        //         id: '22502218'
        //     },
        //     remaining: 4988,
        //     limit: 5000
        // }

        // {
        //     result: {
        //         object: 'user',
        //         object_id: null,
        //         aspect: 'media',
        //         callback_url: 'http://dev.tmshv.ru/callback/hudozka',
        //         type: 'subscription',
        //         id: '22501989'
        //     },
        //     remaining: 4995,
        //     limit: 5000
        // }
        await instagram.subscriptions.subscribeUser(callbackUrl);
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
