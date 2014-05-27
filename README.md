# Model-cast

Automatically cast properties for Swatinem/model

Works for Construction as well as for assignments.

[![Build Status](https://travis-ci.org/Swatinem/model-cast.png?branch=master)](https://travis-ci.org/Swatinem/model-cast)
[![Coverage Status](https://coveralls.io/repos/Swatinem/model-cast/badge.png?branch=master)](https://coveralls.io/r/Swatinem/model-cast)
[![Dependency Status](https://gemnasium.com/Swatinem/model-cast.png)](https://gemnasium.com/Swatinem/model-cast)

## Installation

    $ component install Swatinem/model-cast

## .cast(name, fn)

Registers a cast function `fn` that will be called on construct time with the
value of the `name` property and is expected to return a new value.

**note**: The casting function MUST handle values which are already of the
target type.

## cast.Date

Casts to a `Date`.

## cast.Cache(Model)

Fetches the `Model` instance according to the provided key. This is intended to
work with [Swatinem/model-cache](https://github.com/Swatinem/model-cache).

## Usage

```js
var Model = require('model');
var cast = require('model-cast');

var User = new Model(['time'])
	.use(cast)
	.cast('time', cast.Date)
	.cast('cached', cast.Cache(CachedModel));

var instance = new User({time: '2014-02-04T13:51:34.662Z', cached: 'cachekey'});

// OR assignment:
instance.time = '2014-02-04T13:51:34.662Z';
instance.cached = 'cachekey';

instance.time instanceof Date; // true
instance.cached instanceof CachedModel; // true
```

## License

  LGPLv3

  Released as free software as part of [ChatGrape](https://chatgrape.com/)

