import {MongoClient} from 'mongodb';
import co from 'co';

export var db;

export function connect(uri){
    return co(function*() {
        db =  yield MongoClient.connect(uri);
        return db;
    })    
}

export function collection(name){
    return db.collection(name);
}
