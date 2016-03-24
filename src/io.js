import socketIO from 'socket.io';
import data from './data';

export default function(server) {
    let io = socketIO(server);
    io.on('connection', socket => {
        // console.log('a user connected');

        // socket.emit('feed', {
        //     type: 'test',
        //     id: 1,
        //     message: 'hello world'
        // });

        // socket.on('my other event', function (data) {
        //     console.log(data);
        // });
    });

    let transfer = name => i => io.emit(name, i);
    let feed = transfer('feed');

    data.feed.on('update', feed);

    data.feed.on('update', i => {
        console.log(`io update ${JSON.stringify(i, null, '\t')}`);
    });
}
