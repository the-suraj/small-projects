// untested

class customPromise {
    constructor (functionParam) {
        this.functionParam = functionParam;
    }

    /**
     * 
     * @param {function} resolve - the given function as a parameter will be called on resolution of promise
     */
    then (resolve, reject) {
        if (typeof resolve === 'function' && typeof OnReject === 'function' && !reject) {

            // this case will be possible if catch() will be called before then() .
            console.error('catch() is called before then()');

        } else if (typeof resolve === 'function') {

            this.OnResolve = resolve;
            this.OnReject = (reject && typeof reject === 'function') ? reject : this.backupRejectionFunction;
            this.callFunctionParam();
        }
        return this;
    }

    /**
     * 
     * @param {function} reject - the given function as a parameter will be called on rejection of promise
     */
    catch (reject) {
        if (typeof this.OnResolve === 'function') {
            reject(this.error);
        } else if (typeof reject === 'function') {
            this.OnResolve = this.backupResolutionFunction;
            this.OnReject = reject;
            this.callFunctionParam();
        }
        return this;
    }

    callFunctionParam () {
        this.functionParam(this.OnResolve, this.OnReject);
    }

    backupRejectionFunction (error) {
        this.error = error;
    }
    backupResolutionFunction (resolution) {
        this.resolution = resolution;
    }
}