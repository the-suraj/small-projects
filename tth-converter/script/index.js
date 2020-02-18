let fileInput = document.getElementById('file-input');
let fileDataDiv = document.getElementById('file-data-div');
let dragZone = document.getElementById('dragZone');

/**
 * 
 * @param {String} text_string - String data
 * @returns {undefined} - undefined
 */
function callback_readTextFile (text_string) {
    paragraphs = text_string.split(/\r\n|\n/);
    paragraphs.forEach(function (para) {
        // to avoid adding empty paragraph if empty lines are present in text file
        if (para) {
            fileDataDiv.insertAdjacentHTML('beforeend', "<p>"+para+"</p>");
        }
    });
}
function handleInputFiles (files) {
    if (files.length === 1) {
        if ('Promise' in window) {
            console.log('Promise is supported in this browser');
            readTextFile(files[0])
                .then(callback_readTextFile)
                .catch(function (err) {console.error(err)});
        } else {
            console.warn('Promise is not supported in this browser');
            readTextFile(files[0], callback_readTextFile)
        }
    } else if (files.length > 1) {
        console.warn('Only first file is selected, else all the files are ignored')
    } else {
        console.error('Something went wronng prease try again after sometime');
    }

    
}
fileInput.addEventListener('input', function (event) {
    handleInputFiles(event.target.files);
});

dragZone.addEventListener('drop', function (event) {
    event.stopPropagation();
    event.preventDefault();
    fileInput.files = event.dataTransfer.files;
    handleInputFiles(event.dataTransfer.files);
})
dragZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});