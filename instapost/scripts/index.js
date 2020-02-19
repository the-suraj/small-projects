const postLinkInput = document.getElementById('post-link-input');
const fetchPostButton = document.getElementById('fetch-post-button');
const embedPostSection = document.getElementById('embed-post-section');
const postDownloadButton = document.getElementById('post-download-button');

let downloadProfile = () => {
    requestData(postDownloadButton.dataset.thumbnail_url, "blob")
    .then((data) => {
        let blob = new Blob([data], { type: 'image/jpeg' });
        let elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = postDownloadButton.dataset.author_name + '.jpeg';
        elem.style.display = 'none';
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    });
    
};

postDownloadButton.addEventListener('click', downloadProfile)