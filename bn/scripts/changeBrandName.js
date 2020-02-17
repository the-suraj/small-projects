alp = "abcdefghijklmnopqrstuvwxyz";

/**
 * 
 * @param {object} obj - an object with properties 'value' and 'place';
 */

let increment = (obj = {count : 1, place : 1}) => {
    console.log('increment function > start point');
    for (let index = 0; index < obj.count; index++) {
        if (obj.place > document.getElementsByClassName('main--BrandName')[0].children.length) {
            console.log('increment function > for loop > no more words!')
            return false;
        }
        let target_span = document.getElementById(`letter-${obj.place}`);
        if (target_span.dataset.value == 26) {
            console.log('increment function > for loop > if true');

            // if the previous letter can be incremented then only reset current target_span, else stop;
            if (increment({count: 1, place: obj.place+1})) {
                target_span.dataset.value = '1';
                target_span.innerText = 'a';
                return true;
            } else {
                return false;
            }
        } else {
            console.log('increment function > for loop > if false');
            target_span.dataset.value = `${parseInt(target_span.dataset.value) + 1}`;
            target_span.innerText = alp[target_span.dataset.value - 1];
            return true;
        }
    }
}

let decrement = (obj = {count : 1, place : 1}) => {
    console.log('decrement function > start point');
    for (let index = 0; index < obj.count; index++) {
        if (obj.place > document.getElementsByClassName('main--BrandName')[0].children.length) {
            console.log('decrement function > for loop > no more words!')
            return false;
        }
        let target_span = document.getElementById(`letter-${obj.place}`);
        if (target_span.dataset.value == 1) {
            console.log('decrement function > for loop > if true');

            // if the previous letter can be decremented then only reset current target_span, else stop;
            if (decrement({count: 1, place: obj.place+1})) {
                target_span.dataset.value = '26';
                target_span.innerText = 'z';
                return true;
            } else {
                return false;
            }
        } else {
            console.log('decrement function > for loop > if false');
            target_span.dataset.value = `${parseInt(target_span.dataset.value) - 1}`;
            target_span.innerText = alp[target_span.dataset.value - 1];
            return true;
        }
    }
}

let copyName = (name) => {
    navigator.clipboard.writeText(name)
        .then(() => {
            console.log('Async: Password Copied to ClipBoard');
        })
        .catch((err) => {
            console.log(err);
        });
    return null;
};

document.getElementById('next-name').addEventListener('click', () => {increment({count : 1, place : 1})});
document.getElementById('pre-name').addEventListener('click', () => {decrement({count : 1, place : 1})});
let mainBrandName = document.getElementsByClassName('main--BrandName')[0];
let copyBtn = document.getElementById('copy-btn');
copyBtn.addEventListener('click', () => {
    copyName(mainBrandName.innerText.replace(/ /g, ''));
});