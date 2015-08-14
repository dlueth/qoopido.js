/*
 * Qoopido polyfill/document/getelementsbyclassname
 *
 * Borrowed from:
 * https://github.com/inexorabletash/polyfill
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @polyfill ./queryselectorall
 */
;(function(definition, global) {
	var dependencies = [];

	if(!Object.defineProperty) {
		dependencies.push('./queryselectorall');
	}

	global.qoopido.register('polyfill/document/getelementsbyclassname', definition, dependencies);
}(function(modules, shared, global, undefined) {
	'use strict';

	var document = window.document;

	if(!document.getElementsByClassName) {
		var regex = new RegExp('^|\\s+', 'g');

		document.getElementsByClassName = function(classname) {
			classname = String(classname).replace(regex, '.');

			return document.querySelectorAll(classname);
		};
	}

	return document.getElementsByClassName;
}, this));