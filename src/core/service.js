import {instagramToken} from '../config';

export const services = {
    instagram: instagramToken
};

export const checkAuth = (name, token) => name in services && services[name] === token;
export const authChecker = store => (name, token) => name in store && store[name] === token;