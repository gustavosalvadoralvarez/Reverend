var j$ = require('jStat').j$; 

function prob (counts, callback) { 
	var t, log, exp, a1, b1, a2, b2;
	b1 = parseInt(counts[0][1], 10);
	b2 = parseInt(counts[1][1], 10);
	a1 = parseInt(counts[0][0], 10);
	a2 = parseInt(counts[1][0], 10);
	log = Math.log;
	exp = Math.exp;
	(function calc (k, t, callback) { 
		if (k > (a1 - 1)) { return callback(null, t)} 
		t +=  exp(k * log(b1) + a2 * log(b2) - (k + a2)*log(b1 + b2) - log(k + a2) - j$.betaln(k+1, a2)); 
		calc(++k, t, callback);})
	(0, 0, callback);}


(function () { 
	var c = [], rand = Math.random, fl = Math.floor;
	for (var i = 0; i < 200000; i++){ 
		c.push([[fl(rand()*1000),fl(rand()*10000)],[fl(rand()*1000),fl(rand()*10000)]]);
	}
	c.forEach(function(v){prob(v, console.log)});
})()

