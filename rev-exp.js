var cache = {};

var value_types = ['vhash', ' number', 'ident', 'percentage', 'shash']

function parse_revCSSP (ast, callback){ 
///////////////////////////////////////////////////////////////////
// :: array[array[...]],
//	  function :: err, res
// =async=> function(err, array[array[...]])
// 
// 1. takes ast and runs cmap with ['simpleselector','value'] as ids 
//    and a function that tests whether the resulting aray contains 
//    an r-comment, defined by a comment commencing with 'r>'
// 2. if the bock contains an r-comment, it is passed to interpret_rdata
//    which returns it asynchroneously with an r-experiment block replacing the r-comment
// 3. when the process terminates, the resulting ast map is passed to callback
//
	var re, fn;
	re = new RegExp('r>');
	fn = function (v, callback){
			if (re.test(v.toString())) {
				var rdata, rcom, rcom_indx;
				function rfn (p, c, i) { 
					rcom = 
						c[0] === 'comment' && re.test(c[1]) 
						? c[1] 
						: null;
					rcom_indx = 
						rcom 
						? i 
						: null;
				return rcom}
				rdata = v.reduce(rfn);
				v.pop(rcom_indx);
			return interpret_rdata(v, rdata, callback);}
		return callback(null, v)}
require('./rev-ast.js').cmap(ast, ['simpleselector','value'], fn, callback)} 


function interpret_rdata (v, rdata, callback) { 
	var vals, block, expid, cache_entry; 
	function mfn (v, i) {
		if (typeof v === 'string' || v[0] === 's') { 
		return v} 
		if (vals.length) { 
			var val, expobj;
			val = vals.shift();
			if (val === '^'){ 
			return v;}
			expobj =  {id : expid, val: val, rdata: rdata, type: v[0]};
			cache_entry.trials[i] = expobj;
		return v.concat([['rexp', expobj]])}
	return v}
	vals = rdata.substring(2).trim().split(' ');
	expcount = 0;
	expid = (function () {return Math.floor(Math.random()*100000)})();
	cache_entry = cache[expid] = {};
	cache_entry.trials = {};
	block =	v.map(mfn);  
	cache_entry.block = JSON.stringify(block);
callback(null, block);}


function init_trials (exps, callback) {
	var funcs = require('./rev-funcs.js');
	async.each(Object.keys(exps), 
		function (k, callback) { 
			var exp, trials, block;
			exp = exps[k];
			trials = exp.trials;
			block = JSON.parse(exp.block);
			async.each(Object.keys(trials),
				function (k, callback) { 
					var trial, typ, A, B;
					trial = trials[k];
					typ = t.type;
					switch (typ) { 
						case "dimension" || "percentage": 
							A = parseInt(block[k][1][1], 10); // edge cases?
							B = funcs.mutate_num(A, trial.val);
							break; 
						case 'ident': 
							A = block[k][1];
							B = 
							break; 
						case 'shash'

					}
				}
			})
		})
	
}
*/

module.exports.generate = parse_revCSSP;

module.exports.cache = cache;



















/*
module.exports.toCSS = function (exps, callback) { 
		var g = {},
			exps = self._exps;
		ast.cmap(self._exp.ast,
			exps, 
			function (v, callback) {
				var e = v[v.length - 1][1],
					c = Math.random() > 0.5 ? 'A': 'B';
				if (!e || !c) { callback("failed at expCSS"); return}
				v[1][1] = e[c];
				g[e.id] = c;
				callback(null, v.slice(0, v.length - 1))},
			function (err, res) { 
				res.push(['comment', "-rev-data-"+JSON.stringify(g)]);
				var css = gonzo.csspToSrc(res);
				callback(null, css)})} */