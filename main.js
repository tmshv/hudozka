const CONTENT_PATH = "http://hudozhka.tmshv.ru/files/";
const CONTENT_PATH = "/files/";

var fs = require("fs");

function gatherNotFoundCollection (dir) {
	var list = fs.readdirSync(dir);
	if(list){
		list.forEach(function(i){
			
		});	
	}
	return [];
}

var config = require("./config").populate({
	
});