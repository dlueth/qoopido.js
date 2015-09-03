;(function(global, demand, provide) {
	'use strict';

	function definition() {
		demand
			.configure({
				pattern: {
					'/qoopido': 'https://rawgit.com/dlueth/qoopido.js/release/4.0.0/dist/latest/min',
					'/jquery': '//cdn.jsdelivr.net/jquery/2.1.4/jquery.min'
				},
				probes: {
					'/jquery': function() { return global.jQuery; }
				}
			});

		demand('app/test', '/qoopido/component/iterator', '/jquery')
			.then(
			function(appTest, qoopidoComponentIterator, jQuery) {
				console.log('[success]', appTest, qoopidoComponentIterator, jQuery);

				new qoopidoComponentIterator();
			},
			function() {
				console.log('[error]', arguments);
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
				console.log('[success] /default => ', cssDefault);

				cssDefault.media = 'screen';
			},
			function() {
				console.log('[error] /default =>', arguments);
			}
		);

		return true;
	}

	provide(definition);
}(this, demand, provide));