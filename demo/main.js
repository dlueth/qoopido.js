;(function() {
	'use strict';

	demand
		.configure({
			version: '1.0.0',
			base:    'https://cdn.rawgit.com/dlueth/qoopido.js/release/4.0.0/demo',
			pattern: {
				'/qoopido': 'https://cdn.rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min',
			}
		});

	demand('app/test', '/qoopido/component/iterator')
		.then(
			function(appTest, qoopidoComponentIterator) {
				console.log('[success]', appTest, qoopidoComponentIterator);

				new qoopidoComponentIterator();
			},
			function(error) {
				console.log('[error]', error);
			}
		);

	function definition(appTest, qoopidoBase) {
		console.log('[success] /app/main =>', appTest, qoopidoBase);

		return function appMain() {

		}
	}

	provide('/app/main', definition)
		.when('test', '/qoopido/base');

	demand('text/css!default')
		.then(
			function(cssDefault) {
				console.log('[success]', cssDefault);

				cssDefault.media = 'screen';
			},
			function(error) {
				console.log('[error]', error);
			}
		);
}());