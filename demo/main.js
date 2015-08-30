;(function() {
	'use strict';

	demand
		.configure({
			base: 'https://rawgit.com/dlueth/qoopido.js/release/4.0.0/demo',
			pattern: {
				'/qoopido': 'https://rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min'
			}
		});

	demand('app/test', '/qoopido/component/iterator')
		.then(
			function(appTest, qoopidoComponentIterator) {
				console.log('=> success', appTest, qoopidoComponentIterator);

				new qoopidoComponentIterator();
			},
			function(error) {
				console.log('=> error', error);
			}
		);

	function definition(appTest, qoopidoBase) {
		console.log('/app/main', appTest, qoopidoBase);

		return function appMain() {

		}
	}

	provide('/app/main', definition).when('test', '/qoopido/base');
}());