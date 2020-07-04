const startCapture = async () => {
    const displayMediaOptions = {
        video: {
            cursor: "always"
        },
        audio: false /*{
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }*/
    }
    const captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    return captureStream;
}