console.log('Worker is running');

onmessage = function(e) {
    console.log('Message received from main script', e);
    let number = e.data;
    let workerResult = 'subtracted to zero: ';
    for (let index = 0, num = e.data; index < num; index++) {
        number--;
    }
    console.log('Posting message back to main script');
    postMessage(workerResult + number);
}