var async = require('async');
var j$ = require('jStat').j$;
var gonzo = require('gonzales');

function Reverend (cssFile, ops) { 
	var self = this; 
	self._ast = gonzo.srcToCSSP(require('fs').readFileSync(cssFile).toString());
	self._exp = {};
	self._func = {}
	self._exp.ast = self._ast;
	self._exps = [];
	self.ast = require('./rev-ast.js');
	self.exp = require('./rev-exp.js');

	self._ops = (function (ops) { 
		var o = {};
		o.maxt = ops.maxt ? ops.maxt : 4000;
		o.ci = ops.ci ? ops.ci : 0.95;
		o.maxexp = ops.maxexp ? ops.maxexp : 1000;
		o.nullcounts = ops.nullcounts ? o.nullcounts : [[1,10],[1,10]];
		o.sd = ops.sd  ? o.sd : 0.5;
		return o;})(ops || {});

	///////////////////////////////////////////////////////////
	// Main AST navigation function


	////////////////////////////////////////////////////////////////
	// Numerical operations
	self._func.prob = function (counts, callback) { 
		var max, t, log, exp, a1, b1, a2, b2;
		max = self._ops.maxt;
		b1 = parseInt(counts[0][1], 10);
		b2 = parseInt(counts[1][1], 10);
		a1 = parseInt(counts[0][0], 10);
		a2 = parseInt(counts[1][0], 10);
		log = Math.log;
		exp = Math.exp;
		(function calc (k, t, callback) { 
			if (k > (a1 - 1)) { callback(null, t); return; } 
			t +=  exp(k * log(b1) + a2 * log(b2) - (k + a2)*log(b1 + b2) - log(k + a2) - j$.betaln(k+1, a2)); 
			calc(++k, t, cb);})(0, 0, callback);}

	self._func.precision = {};
	self._func.precision.px = function (num) { return  num - num%(1/64); }

	//////////////////////////////////////////////////////////
	// Handle experiments
	self._exp.mutate = function (exp, callback) { 
		var ci, counts, nullcnt, type;
		ci = self._ops.ci;
		nullcnt = self._ops.nullcounts[1];
		counts = exp.counts,
		type = exp.type;
		self._func.prob(counts, 
			function (err, p) { 
				if (err) { callback(err); return}
				var mtnt, delta, w, a, cnts, presc = self._func.precision[type];
				if (p > ci || p < (1 - ci)) { 
					switch (counts[0][0]/counts[0][1] - counts[1][0]/counts[1][1] > 0 ? 'A' : 'B') { 
						case 'A': 
							w = exp.w + p;
							delta = j$.normal.sample(0, exp.s0/w);
							a = exp.A;
							cnts = [exp.counts[0], nullcnts];
							break;
						case 'B': 
							w = p;
							delta = j$.normal.sample(0, exp.s0/w);
							a = exp.B 
							cnts = [exp.counts[1], nullcnts];
							break;
						default: 
							callback("failed at mutate switch");}}
				else if (counts[1][1] > self._ops.maxt) {  
					w = exp.w;
					delta = j$.normal.sample(0, exp.s0/w);
					a = exp.A;
					cnts = [exp.counts[0], nullcnts];}
				b = presc ? presc(a + delta) : a + delta;
				mtnt = delta ? self._exp.generate.exptemplate.call(null, a, b, cnts, w, s, type) : exp;
				callback(null, mtnt);})}
/*
	self.exp.gen = function (ast, callback){ 
		var re, fn;
		re = new RegExp('r>');
		fn = function (v, callback){
				if (re.test(v.toString())){
					console.log(v)
					console.log("R COMMENT");
					callback(null, ["exp", ])}
				else {callback(null, v)}}
		self.ast.cmap(ast, ['simpleselector','value'], fn, callback)} */

	self._exp.generate = function (idstr) { 
		var that = this, mkexp;
		that.exptemplate = function (a, b, counts, w, s, type) { 
				var id = Math.floor(100000*Math.random()),
					counts = counts ? counts : self._ops.nullcounts,
					s = s ? s : self._ops.sd;
				return [['exp', {'id': id,'A': a,'B': b,'counts' : self._ops.nullcounts,'w': 0.5,'s0': self._ops.sd, 'type': type }]]};
		switch (idstr) { 
			case "dimension" : 
				mkexp = function (v, callback) { 
							var a = parseInt(v[1][1], 10),
								s = parseInt(self._ops.sd, 10),
								w = 0.5,
								b = (a + j$.normal.sample(0, s/w)).toFixed(2),
								type = v[2][1];
								exp = that.exptemplate.call(null, a, b, null, w, s, type);
							callback(null, v.concat(exp));}
				break;
			default : 
				throw new Error ("could not generate exp")}
		self.ast.cmap(self._ast, idstr, mkexp, function (err, res) { if (err) { return console.log(err)} self._exp.ast = res; })
		self._exps.push(idstr);}
	
	self._exp.toCSS = function (callback) { 
		var g = {},
			exps = self._exps;
		self.ast.cmap(self._exp.ast,
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
				callback(null, css)})}

	self._exp.update = function (countobj, callback) { 
		// :: [[id, counts]]
		function _update (v, callback) { 
			var id = v[1][1], counts = countobj[id];
			if (counts){ 
				return self.ast.cmap.subtree('counts', 
					function (v, callback){ 
						var r = v[1].map(
							function (v,i) {
								return v.map( 
									function (v2, i2) { 
										return v2 + this[i][i2];})});
						callback(null, r);},
					callback, 
					v)}
			callback(null, v)};
		self.ast.cmap(self._exp.ast, 'exp', _update, callback, self._exp.ast);}

		

	return self;}

var r = new Reverend('./css/main.css');
r.exp.generate(r._ast, function (err, res) { console.log();require('fs').writeFileSync("./samples/exp1.json", JSON.stringify(res, null, '\t'))});
//r._exp.generate('dimension');
//r.ast.cmap('dimension', function (x, c) { console.log("dimension: "+x); c(null, x); })
//r._exp.toCSS(function (err, res){ console.log(res); require('fs').writeFileSync("boilerplate_sample_mutation.css", res);});
