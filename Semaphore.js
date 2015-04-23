'use strict';

/**
 * A counting semaphore based on Java's Concurrent Semaphore.
 * 
 * @param {Integer} permits Initial value of available permits. Default is 0.
 * @param {Boolean} isFair Set to true for FIFO rules. Default value is false.
 * @returns {Semaphore}
 */
function Semaphore(permits, isFair) {
    permits = this._parsePermits(permits, 0);

    if (typeof isFair !== 'boolean') {
        isFair = false;
    }

    this.available = permits;
    this.acquirers = [];
    this.isFair = isFair;
}

/**
 * Returns the current number of permits available in this semaphore.
 * 
 * @returns {Integer}
 */
Semaphore.prototype.availablePermits = function() {
    return this.available;
};

/**
 * Acquires the given number of permits from this semaphore.
 * 
 * @param {Integer} permits Default value is 1.
 * @param {Function} handler
 */
Semaphore.prototype.acquire = function(permits, handler) {
    if (typeof permits === 'function') {
        handler = permits;
        permits = 1;
    } else {
        permits = this._parsePermits(permits, 1);
    }

    this.acquirers.push({
        permits : permits,
        handler : handler
    });

    this._checkSemaphore();
};

/**
 * Returns an estimate of the number of acquirers waiting to acquire.
 * 
 * @returns {Function[]}
 */
Semaphore.prototype.getQueueAcquirers = function() {
    var handlers = [];

    this.acquirers.forEach(function(acquirer) {
        handlers.push(acquirer.handler);
    });

    return handlers;
};

/**
 * Returns an estimate of the number of acquirers waiting to acquire.
 * 
 * @returns {Integer}
 */
Semaphore.prototype.getQueueLength = function() {
    return this.acquirers.length;
};

/**
 * Releases the given number of permits, returning them to the semaphore.
 * 
 * @param {Integer} permits Default value is 1.
 */
Semaphore.prototype.release = function(permits) {
    permits = this._parsePermits(permits, 1);

    this.available += permits;

    this._checkSemaphore();
};

/**
 * Checks the semaphore on which acquirers to be called.
 */
Semaphore.prototype._checkSemaphore = function() {
    // if no available permits
    if (!this.available) {
        return;
    }
    // no queued acquirers
    else if (!this.acquirers.length) {
        return;
    }

    // check the acquirers
    var len = this.acquirers.length;

    for (var idx = 0; idx < len; idx++) {
        var acquirer = this.acquirers[idx];

        if (acquirer.permits > this.available) {
            // if fairness is true, FIFO rules applied
            if (this.isFair) {
                return;
            }

            continue;
        }

        // reduce the acquirers and availablePermits
        this.acquirers.splice(idx--, 1);
        len--;
        this.available -= acquirer.permits;

        // for scope handling for non-blocking calling
        (function(handler) {
            process.nextTick(function callAcquirer() {
                handler.call(this);
            });
        })(acquirer.handler);
    }
};

/**
 * Acquires and returns all permits that are immediately available.
 * 
 * @returns {Integer}
 */
Semaphore.prototype.drainPermits = function() {
    var drained = this.available;
    this.available = 0;

    return drained;
};

/**
 * Shrinks the number of available permits by the indicated reduction.
 * 
 * @param {Integer} permits
 */
Semaphore.prototype.reducePermits = function(permits) {
    permits = this._parsePermits(permits, 0);

    this.available -= permits;
};

/**
 * Acquires the given number of permits from this semaphore,
 * only if all are available at the time of invocation.
 * 
 * @param {Integer} permits Default value is 1.
 * @returns {Boolean}
 */
Semaphore.prototype.tryAcquire = function(permits) {
    permits = this._parsePermits(permits, 1);

    var isSuccess = this.available >= permits;

    return isSuccess;
};

/**
 * Parses the `permits` parameter. Return 0 if invalid or less than to 0.
 * 
 * @param {Integer} permits
 * @param {Integer} initVal
 * @returns {Integer}
 */
Semaphore.prototype._parsePermits = function(permits, initVal) {
    if (!permits) {
        return initVal;
    }

    permits = parseInt(permits);

    return isNaN(permits) ? initVal : permits;
};

/**
 * Module Exports
 */
module.exports = Semaphore;