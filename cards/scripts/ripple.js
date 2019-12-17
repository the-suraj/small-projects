showRippleOnClick = (obj) => {
    obj.addEventListener('click', () => {
        obj.classList.add('ripple');
        let timeout = setTimeout(() => {
            obj.classList.remove('ripple');
        }, 1000);
    });
}

let card_navigator_buttons = document.getElementsByClassName('card-navigator-button');
[...card_navigator_buttons].forEach(button => showRippleOnClick(button));