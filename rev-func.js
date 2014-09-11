var j$ = require('jStat').j$; 

function prob (counts, callback) { 
///////////////////////////////////////////
// :: array[[number, number],[number, number]],
//    function :: err, res
// =async=> function(err, res)
//
// excecutes a bayesian inference algorithm
// for the probabiliy that Poisson process 1
// has a greater mean (frequency) than Poiss process 2
// using gamma parameter priors, where
// Poiss. 1 ~ gamma(counts[0][0], counnts[0][1])
// Poiss. 2 ~ gamma(counts[1][0], counnts[1][1])
//
	var t, log, exp, a1, b1, a2, b2, betaln; 
	b1 = parseInt(counts[0][1], 10);
	b2 = parseInt(counts[1][1], 10);
	a1 = parseInt(counts[0][0], 10);
	a2 = parseInt(counts[1][0], 10);
	log = Math.log;
	exp = Math.exp;
	betaln = j$lbetaln;
	(function calc (k, t, callback) { 
		if (k > (a1 - 1)) { return callback(null, t)} 
		t +=  exp(k * log(b1) + a2 * log(b2) - (k + a2)*log(b1 + b2) - log(k + a2) - betaln(k+1, a2)); 
		calc(++k, t, callback);})
	(0, 0, callback);}

function sum_counts (c1, c2) { 
	return c1.map(
		function (v,i) {
			return v.map( 
				function (v2, i2) { 
					return v2 + c2[i][i2];})})};

function float_to_pixel (num) {return  num - num%(1/64)}

