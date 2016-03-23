import Data from './Data';

export default class Feed extends Data {
    constructor() {
        super('timeline');
    }

    add(post) {
        let add = async(post) => {
            const id = post.id;
            const type = post.type;
            const query = {id: id, type: type};

            await this.store.update(query, post, {upsert: true});

            let document = await this.store.find(query).limit(1).toArray();
            document = document[0];
            // post._id = `schachlo-${Date.now()}`;
            // let document = post;

            this.update(document);
            return document;
        };
        return add(post);
    }

    read(id) {

    }

    portion() {

    }
}
