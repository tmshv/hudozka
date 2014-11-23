/**
 * Created by tmshv on 22/11/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
        id: {type: String, required: true, index: {unique: true}},
        author: {type: String, default: []},
        type: {type: String, enum: ["post", "instagram"]},
        publishDate: Date,
        body: String,
        data: Object
    }
);

var Post = mongoose.model("Post", schema, "posts");
module.exports = Post;