;(function(global) {
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
			function() {
				console.log('=> error');
			}
		);


	function definition(appTest, qoopidoBase) {
		console.log('/app/main', appTest, qoopidoBase);

		new qoopidoBase();

		return function appMain() {

		}
	}

	provide('/app/main', definition, 'test', '/qoopido/base');

	/*
	function definition(test, Iterator) {
		new Iterator()
			.on('preSeek postSeek', function(event, args, result) {
				console.log(event, args, result);
			})
			.setData([ 1, 2, 3, 4])
			.seek(2);

		//console.log(new Iterator());
	}

	provide('app/main', definition, 'test', '/qoopido/component/iterator');
	*/

	/*
	demand('qoopido/newemitter').then(
		function(emitter) { console.log('hier', emitter);}
	);
	*/
}(this));