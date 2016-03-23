import {MongoClient, ObjectId} from 'mongodb';
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

export const c = collection;

export function id(i){
    if(typeof i === 'string')return ObjectId(i);
    else if(i instanceof ObjectId) return i;
    else if(i instanceof Object) return '_id' in i ? ObjectId(i._id) : null;
    return null;
}
