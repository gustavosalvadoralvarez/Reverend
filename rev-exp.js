var ast = require('./rev-ast.js');



function interpret_rdata (v, rdata, callback) { 
	var vals, block, expid; 
	function mfn (v, i) {
		if (typeof v === 'string' || v[0] === 's') { 
		return v} 
		if (vals.length) { 
		return v.concat([['rexp', {id : expid(), val: vals.shift()}]])}
		return v}
	vals = rdata.substring(2).trim().split(' ');
	expid = function () {return Math.random()*100000};
	block =	v.map(mfn);  
	callback(null, block);}



function generate (ast, callback){ 
		var re, fn;
		re = new RegExp('r>');
		fn = function (v, callback){
				if (re.test(v.toString())) {
					var rdata, rblock;
					function rfn (p, c, i) { 
						var res = c[0] === 'comment' && re.test(c[1]) 
								? c[1] : null;
						rblock = res 
								? i : null;
						return res}
					rdata = v.reduce(rfn);
					v.pop(rblock);
				return interpret_rdata(v, rdata, callback);}
				return callback(null, v)}
		require('./rev-ast.js').cmap(ast, ['simpleselector','value'], fn, callback)} 



module.exports.generate = generate;





















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