export function pop(data){
	var Populator = function(data){
		this.target = data;
	}
	
	Populator.prototype = {
		populate: function(p){
			var self = this;
			if(typeof p == "function"){
				self.target = p(self.target);
			}else if(p instanceof Array){
				p.forEach(function(i){
					self.target = self.populate(i).result();
				});
				
			}
			return self;
		},
		result: function(){
			return this.target;
		}
	};

	var fun = new Populator(data);
	return fun;
}

export function populate(find, field){
	return function(lesson){
		var id = lesson[field];
		var val = find(id);
		if(val) lesson[field] = val;
		return lesson;
	}
}