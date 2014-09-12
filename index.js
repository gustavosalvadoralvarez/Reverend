var async = require('async');
var j$ = require('jStat').j$;
var gonzo = require('gonzales');

function Reverend (cssFile, ops) { 
	var self = this; 
	self._ast = gonzo.srcToCSSP(require('fs').readFileSync(cssFile).toString());
	self.ast = require('./rev-ast.js');
	self.exp = require('./rev-exp.js');
	self.fnc = require('./rev-func.js');
	self.ops = (function (ops) { 
		var o = {}; /*
		o.maxt = ops.maxt ? ops.maxt : 4000;
		o.ci = ops.ci ? ops.ci : 0.95;
		o.maxexp = ops.maxexp ? ops.maxexp : 1000;
		o.nullcounts = ops.nullcounts ? o.nullcounts : [[1,10],[1,10]];
		o.sd = ops.sd  ? o.sd : 0.5; */
		return o;})(ops || {});
	return self}

var r = new Reverend('./css/main.css');
r.exp.generate(r._ast, function(){})
console.log(JSON.stringify(r.exp.cache, null, '\t'));