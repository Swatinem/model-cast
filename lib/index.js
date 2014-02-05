/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var exports = module.exports = bindCast;

// convenience method because `Date` does not work when called as function
exports.Date = function (d) {
	if (d instanceof Date)
		return d;
	return new Date(d);
};

// convenience method that works well with Swatinem/model-cache
exports.Cache = function (Model) {
	return function (key) {
		if (key instanceof Model)
			return key;
		return Model.get(key);
	};
};

function bindCast(Model) {
	Model.cast = defineCast;
}

function defineCast(name, fn) {
	/* jshint validthis: true */

	var desc = Object.getOwnPropertyDescriptor(this.prototype, name);
	var setter = desc.set;
	desc.set = function (val) {
		setter.call(this, fn(val));
	};
	Object.defineProperty(this.prototype, name, desc);

	return this;
}

