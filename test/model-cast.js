/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var cast = require('../');
var should = require('should');

describe('cast', function () {
	it('should create a new static `cast`', function () {
		var SomeModel = new Model(['prop'])
			.use(cast);
		SomeModel.cast.should.be.type('function');
	});
	it('should allow defining a new cast', function () {
		var SomeModel = new Model(['prop'])
			.use(cast)
			.cast('prop', function () {
				return 'bar';
			});
		var obj = new SomeModel({prop: 'foo'});
		obj.prop.should.eql('bar');
	});
	it('should cast on assignment', function () {
		var SomeModel = new Model(['prop'])
			.use(cast)
			.cast('prop', function () {
				return 'bar';
			});
		var obj = new SomeModel();
		should.not.exist(obj.prop);
		obj.prop = 'foo';
		obj.prop.should.eql('bar');
	});
	describe('cast.Date', function () {
		it('should have a convenience cast for Date', function () {
			var SomeModel = new Model(['time'])
				.use(cast)
				.cast('time', cast.Date);
			var obj = new SomeModel({time: '2014-02-04T13:51:34.662Z'});
			obj.time.should.be.instanceof(Date);
			obj.time.getTime().should.eql(1391521894662);
		});
		it('should not modify a value that is already Date', function () {
			var SomeModel = new Model(['time'])
				.use(cast)
				.cast('time', cast.Date);
			var d = new Date('2014-02-04T13:51:34.662Z');
			var obj = new SomeModel({time: d});
			obj.time.should.be.instanceof(Date);
			obj.time.getTime().should.eql(1391521894662);
			obj.time.should.equal(d);
		});
		it('should cast to date on assignment', function () {
			var SomeModel = new Model(['time'])
				.use(cast)
				.cast('time', cast.Date);
			var obj = new SomeModel();
			should.not.exist(obj.time);
			obj.time = '2014-02-04T13:51:34.662Z';
			obj.time.should.be.instanceof(Date);
			obj.time.getTime().should.eql(1391521894662);
			var d = new Date('2014-02-04T13:51:34.662Z');
			obj.time = d;
			obj.time.should.be.instanceof(Date);
			obj.time.getTime().should.eql(1391521894662);
			obj.time.should.equal(d);
		});
	});
	describe('cast.Cache', function () {
		it('should handle cached Models', function () {
			var SomeModel = new Model(['other'])
				.use(cast)
				.cast('other', cast.Cache(Other));
			function Other() {}
			Other.get = function (key) {
				key.should.eql('key');
				return 'foobar';
			};
			var obj = new SomeModel({other: 'key'});
			obj.other.should.eql('foobar');
		});
		it('should not re-cast cached Models', function () {
			var SomeModel = new Model(['other'])
				.use(cast)
				.cast('other', cast.Cache(Other));
			function Other() {}
			Other.get = function () {
				throw new Error('not reached');
			};
			var other = new Other();
			var obj = new SomeModel({other: other});
			obj.other.should.equal(other);
		});
		it('should cast on assignment', function () {
			var SomeModel = new Model(['other'])
				.use(cast)
				.cast('other', cast.Cache(Other));
			function Other() {}
			Other.get = function (key) {
				key.should.eql('key');
				return 'foobar';
			};
			var obj = new SomeModel();
			obj.other = 'key';
			obj.other.should.eql('foobar');
		});
		it('should not re-cast when assigning correct instance', function () {
			var SomeModel = new Model(['other'])
				.use(cast)
				.cast('other', cast.Cache(Other));
			function Other() {}
			Other.get = function () {
				throw new Error('not reached');
			};
			var other = new Other();
			var obj = new SomeModel();
			obj.other = other;
			obj.other.should.equal(other);
		});
	});
});

