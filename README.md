# async-semaphore

A counting semaphore based on Java's Concurrent Semaphore.

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url]

## Install

Install the module via npm:

    npm install async-semaphore

## Quick Example

```js
// fairness false

var Semaphore = require('async-semaphore');
var semaphore = new Semaphore(0);

semaphore.acquire(2, function() {
  console.log('Hello');
});

semaphore.acquire(function() {
  console.log('World');

  semaphore.release(2);
});

setTimeout(function() {
  semaphore.release();
}, 2000);

// Output after 2 secs: World Hello

```

```js
// fairness true

var Semaphore = require('async-semaphore');
var semaphore = new Semaphore(0, true);

semaphore.acquire(2, function() {
  console.log('Hello');
});

semaphore.acquire(function() {
  console.log('World');

  semaphore.release(2);
});

setTimeout(function() {
  semaphore.release();
}, 2000);

// No output after 2 secs because fairness is true.

```

## Documentation

#### Constructor: Semaphore([`permits`], [`fairness`])

`permits: Integer` Initial available permits of semaphore. `Default: 0`.

`fairness: Boolean` Fairness of semaphore. If set to `true`, a FIFO rules applied, else, look on each acquirers permit value.

#### #availablePermits()

Returns the current number of permits available in this semaphore.

Returns: `Integer`

#### #acquire([`permits`], `handler`)

Acquires the given number of permits from this semaphore.

`permits: Integer` The number of permits to acquire.

`handler: Function` Handler function to call.

#### #getQueueAcquirers()

Returns an estimate of the number of acquirers waiting to acquire.

Returns: `Function[]`

#### #getQueueLength()

Returns an estimate of the number of acquirers waiting to acquire.

Returns: `Integer`

#### #release([`permits`])

Releases the given number of permits, returning them to the semaphore.

`permits: Integer` The number of permits to release.

#### #drainPermits()

Acquires and returns all permits that are immediately available.

Returns: `Integer`

#### #reducePermits(`permits`)

Shrinks the number of available permits by the indicated reduction.

`permits: Integer` The number of permits to remove.

#### #tryAcquire([`permits`])

Acquires the given number of permits from this semaphore.

`permits: Integer` The number of permits to acquire.

## License

The MIT License (MIT)

Copyright (c) 2014 Ian Mark Muninio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/async-semaphore
[npm-version-image]: http://img.shields.io/npm/v/async-semaphore.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/async-semaphore.svg?style=flat
