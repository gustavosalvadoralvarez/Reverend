var ast = require('./rev-ast.js')

module.exports.generate = function (ast, callback){ 
		var re, fn;
		re = new RegExp('r>');
		fn = function (v, callback){
				if (re.test(v.toString())) {
					var rdata = v.reduce( function (p, c) { 
						return  c[0] === 'comment' && re.test(c[1])
									? c[1] 
									: null});
					console.log(rdata)
					callback(null, ["exp", rdata]);
				}
				else {callback(null, v)}}
		require('./rev-ast.js').cmap(ast, ['simpleselector','value'], fn, callback)} 

function interpret_com (v, callback) { 


}
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