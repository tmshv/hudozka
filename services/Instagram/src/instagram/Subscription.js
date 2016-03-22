import EndPoint from './EndPoint';

export default class Subscription extends EndPoint {
    list() {
        const m = this.method('subscriptions');

        return new Promise((resolve, reject) => {
            m((error, result, remaining, limit) => {
                if(error) return reject(error);
                resolve({
                    result: result,
                    remaining: remaining,
                    limit: limit
                });
            });
        });
    }

    subscribeTag(tag, callbackUrl) {
        const m = this.method('add_tag_subscription');

        return new Promise((resolve, reject) => {
            m(tag, callbackUrl, (error, result, remaining, limit) => {
                if(error) return reject(error);
                resolve({
                    result: result,
                    remaining: remaining,
                    limit: limit
                });
            });
        });
    }

    subscribeUser(callbackUrl) {
        const m = this.method('add_user_subscription');

        return new Promise((resolve, reject) => {
            m(callbackUrl, (error, result, remaining, limit) => {
                if(error) return reject(error);
                resolve({
                    result: result,
                    remaining: remaining,
                    limit: limit
                });
            });
        });
    }

    removeAll(){
        // ig.del_subscription({ all: true }, function(err, subscriptions, remaining, limit){});
    }

    remove(id){
        // ig.del_subscription({ id: 1 }, function(err, subscriptions, remaining, limit){});
    }

//     unsubscribe: function *(id) {
//         var ig = createClient();
//         var sub = thunkify(ig["del_subscription"]);
//         try {
//             var s = yield sub({id: id});
//             return s[0];
//         } catch (error) {
//             return null;
//         }
//     },
}