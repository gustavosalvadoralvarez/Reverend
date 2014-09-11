var gonzo = require('gonzales');
var async = require('async');


module.exports.cmap = function (ast, ids, fn, callback) { 
//////////////////////////////////////////////////////////////////////////
// :: array[array], 
//    string || array[string] || function, 
//    function :: array, function =async=> function(err, array[array])
//    function :: err, array[array] 
// =async=> function(err, array[array])
//
// 1. recursively traverses nested arrays (ast)
// 2. if an array passes test (ids), it applies fn, 
//    otherwise returns as is
// 3. excecutes callback with resulting array 
//
// ids can be:
// 1: a string that is matched (===) against the first item in array
// 2: an array of strings each of which is matched against the
//    first item of the array
// 3: a function :: array =sync=> bool
//
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


