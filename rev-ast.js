var gonzo = require('gonzales');
var async = require('async');


module.exports.cmap = function (ast, ids, fn, callback) { 
	var tst = Array.isArray(ids) 
			? function (v){ return ids.indexOf(v[0]) !== -1;}
			: typeof ids === Function 
			? ids
			: function (v){ return v[0] === ids; };
	function astmap(ast, tst, fn, callback) { 
		return async.map(ast, 
			function (v, callback){ 
				if (Array.isArray(v)){ 
					if (tst(v)) {fn(v, callback);} 
					else {astmap(v, tst, fn, callback);}} 
				else {callback(null, v)}}, 
			function (err, res){ 
				if (err) {callback(err)}
				else {callback(null, res)}})}
	astmap(ast, tst, fn, callback);}


