;(function() {
	'use strict';

	function definition(qoopidoBase) {

		function appTest() {

		}

		return qoopidoBase.extend(appTest);
	}

	provide(definition).when('/qoopido/base');
}());