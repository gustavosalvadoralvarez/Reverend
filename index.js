

function Reverend (cssFile, op) { 
	var self = this; 
	self._ast = require('./rev-ast.js');
	self._exp = require('./rev-exp.js');
	self._func = require('./rev-func.js');
	(function init (cssFile, op) { 
		self._cssp = self._ast.to_ast(require('fs').readFileSync(cssFile).toString());})
	(cssFile, op);


	}