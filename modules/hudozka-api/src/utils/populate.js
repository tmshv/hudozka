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

export function populate(fn, key){
	return (dict) => {
		let id = dict[key];
		let value = fn(id);
		dict[key] = value ? value : id;
		return dict;
	}
}