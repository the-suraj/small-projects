let navArray = [{type: 'default', value: document, url: '', from: 'DOM'}];
window.onpopstate = function () {
    console.log('onpopstate called');
    let obj = navArray[navArray.length-1];
    switch (obj.type) {
        case 'toggle_button':
            obj.value.click();
            obj.from = 'popState_function';
            NavigateBackFrom(obj);
            break;
    }
};
let NavigateTo = (param) => {
    navArray.push(param);
    window.history.pushState(navArray[navArray.length-1].url, null, navArray[navArray.length-1].url)
    console.log('NavigateTo', navArray);
}
let NavigateBackFrom = (param) => {
    if (param.from === 'popState_function') {
        navArray.pop();
    } else {
        // navArray = navArray.splice(navArray.lastIndexOf(param), 1);
    }
    console.log(navArray);
}