import EndPoint from './EndPoint';

export default class User extends EndPoint {
    mediaRecent(id = null, count = null, minTime = null, maxTime = null) {
        function callback(resolve, reject) {
            return function (error, medias, pagination, remaining, limit) {
                if (error) return reject(error);
                resolve({
                    medias: medias,
                    pagination: pagination,
                    remaining: remaining,
                    limit: limit
                });
            }
        }

        const options = {};
        if (count) options.count = count;
        if (minTime) options.min_timestamp = minTime;
        if (maxTime) options.max_timestamp = maxTime;

        if (id) {
            let m = this.method('user_media_recent');
            return new Promise((resolve, reject) => {
                m(id, options, callback(resolve, reject));
            });
        } else {
            let m = this.method('user_self_media_recent');
            return new Promise((resolve, reject) => {
                m(options, callback(resolve, reject));
            });
        }
    }
}
