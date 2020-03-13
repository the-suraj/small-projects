function Promise_custom(fn) {
    this.function = fn;
    var self = this;
    this.resolve = function (res) {
        if (self.callOnSuccess_fn) {
            self.callOnSuccess_fn(res);
        }
    }
    this.reject = function (err) {
        self.err = err;
        if (self.callOnFailure_fn) {
            self.callOnFailure_fn(self.err);
        }
    }
    return this;
}
Promise_custom.prototype.then = function (callOnSuccess_fn, callOnFailure_fn) {
    this.callOnSuccess_fn = callOnSuccess_fn;
    this.callOnFailure_fn = callOnFailure_fn;
    this.function(this.resolve, this.reject);
    return this;
}
Promise_custom.prototype.catch = function (callOnFailure_fn) {
    this.callOnFailure_fn = callOnFailure_fn;
    if (this.err) {
        this.callOnFailure_fn(this.err);
    } else if (typeof this.callOnSuccess_fn === 'undefined') {
        this.function(this.resolve, this.reject);
    }
    return this;
}

new Promise_custom(function (resolve, reject) {
    console.log('called');
    setTimeout(() => {
        reject(true)
    }, 1000);
}).then(function (res) {
    console.log('suceed')
}).catch(function (err) {
    console.log('err2')
})