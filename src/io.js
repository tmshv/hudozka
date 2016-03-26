import socketIO from 'socket.io';

export default function(server, store) {
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
    let timeline = transfer('timeline');

    store.timeline.on('update', timeline);
    // store.timeline.on('update', i => {
    //     console.log(`io update ${JSON.stringify(i, null, '\t')}`);
    // });
}
