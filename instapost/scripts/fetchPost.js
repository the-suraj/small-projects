function requestData(url, responseType = "") {

    function httpRequest(resolve, reject) {

        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 0) console.log('RESPONSE UNSENT: Client has been created. open() not called yet.');
            else if (xmlhttp.readyState == 1) console.log('RESPONSE OPENED: open() has been called.');
            else if (xmlhttp.readyState == 2) {
                console.log('RESPONSE HEADERS_RECEIVED: send() has been called, and headers and status are available.');
            }
            else if (xmlhttp.readyState == 3) console.log('RESPONSE LOADING: Downloading responseText holds partial data.');
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log('RESPONSE DONE: The operation is complete.'); /* request is successful and Data is received successfully */
                resolve(xmlhttp.response);
            }
            else if (xmlhttp.status == 404) {
                console.error('File not found'); /* File not found */
                reject("File not found");
            }
            else if (xmlhttp.status == 401 || xmlhttp.status == 403) {
                console.error('request is forbidden by the server'); /* request is forbidden by the server */
                console.log('retry initiated');
                httpRequest(resolve, reject);
            }
            else {
                console.error(`Some unexpected error occured -> Ready State:${xmlhttp.readyState}, Status:${xmlhttp.status}`);
                reject(`Some unexpected error occured -> Ready State:${xmlhttp.readyState}, Status:${xmlhttp.status}`);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.responseType = responseType;
        xmlhttp.send();
    }
    return new Promise(httpRequest);

}

function fetchPostFunction(event) {
    let postLink = postLinkInput.value;
    function dataReceived_callback (txtdata) {
        const data = JSON.parse(txtdata);
        console.log(data);
        postDownloadButton.dataset.thumbnail_url = data.thumbnail_url;
        postDownloadButton.dataset.author_name = data.author_name;
        embedPost(data.html);
    }
    requestData("https://api.instagram.com/oembed/?url="+postLink)
        .then(dataReceived_callback)
        .catch(function (err) { console.error(err) })
}
fetchPostButton.addEventListener('click', fetchPostFunction);