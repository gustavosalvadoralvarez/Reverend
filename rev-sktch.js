var j$ = require('jStat').j$; 

function mutate_number (val, num) { 
	var first, sample, delta;
	function numparse (val)  { 
		this.res = this.res 
				? this.res 
				: parseInt(val.charAt(1), 10); 
		return this.res;}
	first = val.charAt(0);
	sample = j$.normal.sample;
	delta = first === '+' 
			? sample(numparse(val), numparse()*0.5)
			: first === "-"
			? -1*sample(numparse(val), numparse()*0.5)
			: sample(0, parseInt(first, 10));
	return num + delta;}

console.log("+2: "+mutate_number("+2", 98));
console.log("-2: "+mutate_number("-2", 98));
console.log("2: "+mutate_number("2", 98));