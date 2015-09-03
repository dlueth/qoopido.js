;(function(global, demand, provide) {
	'use strict';

	function definition() {
		// example: configuration
			demand
				.configure({
					pattern: {
						'/adapter':       'https://rawgit.com/dlueth/qoopido.demand/development/dist/latest/min/adapter',
						'/qoopido/4.0.0': 'https://rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min',
						'/qoopido/3.7.4': '//cdn.jsdelivr.net/qoopido.js/3.7.4',
						'/jquery':        '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min'
					},
					probes: {
						'/jquery': function() { return global.jQuery; }
					}
				});

		// example: demand usage
			// loading a single module without further dependencies
				demand('app/test')
					.then(
						function(appTest) {
							console.log('demand module /app/test loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// loading a single, more complex module with further dependencies
				demand('/qoopido/4.0.0/component/iterator')
					.then(
						function(componentIterator) {
							console.log('demand module /qoopido/4.0.0/component/iterator loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// loading multiple modules with further dependencies and a probe (~=shim)
				demand('/qoopido/4.0.0/component/iterator', '/jquery')
					.then(
						function(componentIterator, jQuery) {
							console.log('demand module /qoopido/4.0.0/component/iterator & external /jquery loaded');
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);

			// loading CSS with demand
				demand('text/css!default')
					.then(
						function(cssDefault) {
							console.log('demand module /default (text/css) loaded');

							cssDefault.media = 'screen';
						},
						function() {
							console.log('error loading modules', arguments);
						}
					);


			// providing a simple inline module without dependencies
				function definition1() {
					console.log('demand module /app/example1 provided');

					return function appExample1() {

					}
				}

				provide('/app/example1', definition1);

			// providing an inline module with dependencies
				function definition2(appExample1, jQuery) {
					console.log('demand module /app/example2 provided');

					return function appExample2() {

					}
				}

				provide('/app/example2', definition2)
					.when('/app/example1', '/jquery');

		// example: load & use require.js adapter
			demand('/adapter/require')
				.then(
					function(adapter) {
						// adapter.require is also register as "require" in global scope
						adapter.require([ '/qoopido/3.7.4/base' ], function(base) {
							console.log('require.js module /qoopido/3.7.4/base loaded');

							adapter.require([ '/qoopido/3.7.4/component/iterator' ], function(componentIterator) {
								console.log('require.js module /qoopido/3.7.4/component/iterator loaded');
							});
						});

						// adapter.define is also register as "define" in global scope
						adapter.define('/app/example3', function() {
							console.log('require.js module /app/example3 defined');
						});

						// define with dependencies
						adapter.define('/app/example4', [ '/jquery' ], function(jQuery) {
							console.log('require.js module /app/example4 defined');
						});
					}
				);

		return true;
	}

	provide(definition);
}(this, demand, provide));