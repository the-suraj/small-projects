/**
 * 
 * @param {Object} file - text file downloaded or uploaded
 * @param {function} callbackOnResolve - data will be passed to this callback function.
 * @param {function} callbackOnReject - error will be passed to this callback function.
 * @returns {Promise} if callback funtion is not passed then Text data as String on resolution or Error message as String on rejection.
 * @returns {Sting} if callback funtion is passed then Text data as String or Error message as String to there respective callback functions.
 * 
 */
function readTextFile (file, callbackOnResolve, callbackOnReject) {
    function getData(resolve, reject) {

        // validating input
        if (file && file.type && file.type === 'text/plain') {

            // initializing file reader instance
            let reader = new FileReader();

            reader.onload = function (event) {
                let data = event.target.result;
                resolve(data);
            }

            reader.readAsText(file, "UTF-8");

        } else {
            let error = 'Something went wrong';
            if (file) {
                if (file.type) {
                    if (file.type !== 'text/plain') {
                        error = file.name + ' is not a text file. Text files ends with *.txt extention';
                        reject(error);
                    } else {
                        reject(error);
                    }
                } else {
                    error = 'file.type if falsey, type property is : ' + file.type;
                    reject(error);
                }
            } else {
                error = 'Error in input, File is : ' + file;
                reject(error);
            }
        }


    }
    if (callbackOnResolve) {
        if (callbackOnReject) {
            return getData(callbackOnResolve, callbackOnReject);
        } else {
            return getData(callbackOnResolve, function (err) {console.error(err)});
        }
    } else {
        return new Promise(getData);
    }


}