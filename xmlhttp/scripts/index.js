const urlInput = document.getElementById('url-input');
const fetchUrlButton = document.getElementById('fetch-url-button');
const responseHTML = document.getElementById('responseHTML');

function requestData(url, responseType = "") {

    function httpRequest(resolve, reject) {

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 0) console.log('RESPONSE UNSENT: Client has been created. open() not called yet.');
            else if (xmlhttp.readyState == 1) console.log('RESPONSE OPENED: open() has been called.');
            else if (xmlhttp.readyState == 2) {
                console.log('RESPONSE HEADERS_RECEIVED: send() has been called, and headers and status are available.');
            }
            else if (xmlhttp.readyState == 3) console.log('RESPONSE LOADING: Downloading responseText holds partial data.');
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log('RESPONSE DONE: The operation is complete.'); /* request is successful and Data is received successfully */
                console.log('xmlhttp.readyState == 4 & xmlhttp.status == 200');
                resolve(xmlhttp.response);
            }
            else if (xmlhttp.status == 404) {
                // console.error('File not found'); /* File not found */
                reject({statusCode: xmlhttp.status, discription: "File not found"});
            }
            else if (xmlhttp.status == 401 || xmlhttp.status == 403) {
                // console.error('request is forbidden by the server'); /* request is forbidden by the server */
                reject({statusCode: xmlhttp.status, discription: "request is forbidden by the server"});
                // console.log('retry initiated');
                // httpRequest(resolve, reject);
            }
            else {
                console.error(`Some unexpected error occured -> Ready State:${xmlhttp.readyState}, Status:${xmlhttp.status}`, xmlhttp);
                reject({statusCode: xmlhttp.status,readyState: xmlhttp.readyState, discription: "Some unexpected error occured"});
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader('Accept', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        xmlhttp.responseType = responseType;
        xmlhttp.send();
    }
    return new Promise(httpRequest);

}

function fetchUrlFunction(event) {
    responseHTML.innerText = "";
    let urlLink = urlInput.value;
    function dataReceived_callback (txtdata) {
        console.log(txtdata);
        responseHTML.innerText = txtdata;
    }
    requestData(urlLink)
        .then(dataReceived_callback)
        .catch(function (err) {
            console.error(err)
            responseHTML.innerText = err.discription + ", Open console for detailed view";
        })
}
fetchUrlButton.addEventListener('click', fetchUrlFunction);