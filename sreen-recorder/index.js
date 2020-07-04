/**
 * HTML Elements Reference
 */
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const downloadBtn = document.getElementById('download-btn');
const videoElm = document.getElementById('video-elm');

/**
 * Variables Initialization
 */
let mediaRecorder, recordingState, chunks = [];
const options = { mimeType: "video/webm" };
// const options = { mimeType: "video/webm; codecs=vp8" };

// Set event listeners for the start and stop buttons
startBtn.addEventListener("click", async () => {
    chunks = [];
    const stream = await startCapture();
    videoElm.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start();
}, false);

stopBtn.addEventListener("click", () => {
    stopCapture();
    stopRecording();
}, false);

const stopCapture = () => {
    let tracks = videoElm.srcObject.getTracks();

    tracks.forEach(track => {
        console.log(track);
        track.stop()
    });
    videoElm.srcObject = null;
}
const stopRecording = () => {
    mediaRecorder.stop();
    console.log("stop Recording");
    recordingState = "stop";
}

const handleDataAvailable = async (event) => {
    chunks.push(event.data);
    console.log("handleDataAvailable");
    // download();
}
const handleRecordingStop = () => {
    const blob = new Blob(chunks, { type: options.mimeType });
    const url = window.URL.createObjectURL(blob);
    videoElm.src = url;
}

const download = () => {
    const blob = new Blob(chunks, {
        type: options.mimeType
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
}
downloadBtn.addEventListener('click', download)