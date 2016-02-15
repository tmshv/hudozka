var fs = require("fs");
var path = require("path");
const MENU = require("./models/menu");

const team = require("./models/team");
import {courses} from "./models/course";
const document = require("./models/document");
const schedule = require("./models/schedule");

var privateFile = process.env["PRIVATE"] || "private.json";
var privateData = JSON.parse(fs.readFileSync(privateFile, "utf-8"));

var index_file = process.env["INDEX"] || "templates/main.html";

var config = {
    defaultIndex: path.join(__dirname, index_file),
    port: process.env["PORT"] || 3000,
    pub: "./",
    data: {
        menu: MENU,
        documents: document.docs,
        team: team.team,
        courses: courses
    },

    db: {
        uri: "mongodb://localhost:27017/hudozka"
    },

    prerender: {
        prerender: "http://service.prerender.io/",
        prerenderToken: "",
        protocol: "http",
        host: "art.shlisselburg.org"
    },

    instagram: {
        default_user: "hudozka",
        tag_callback: "http://art.shlisselburg.org/instagram/callback/11",
        client_id: "",
        client_secret: "",
        redirect_uri: "http://art.shlisselburg.org/instagram/auth/callback",
        tags: ["shlb_hudozka"]
    }
};

module.exports = Object.keys(privateData)
    .reduce(function (config, key) {
        config[key] = privateData[key];
        return config;
    }, config);