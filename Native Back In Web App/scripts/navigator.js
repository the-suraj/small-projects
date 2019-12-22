window.history.replaceState('home', document.title, null);
let states = ['home'];
let navArray = [{ type: 'default', value: document, state: 'home', from: 'DOM' }];

window.onpopstate = function (event) {
    console.log('onpopstate called', event.state);
    let comingState = event.state;
    let lastState = states[states.length - 1];

    if (states.indexOf(comingState) === -1) {
        // forward button is clicked

        let ToObj = navArray.filter(obj => obj.state === comingState)[0];
        ToObj.from = 'popState_function';
        NavigateTo(ToObj);
    } else {
        // back button is clicked
        states.pop();
        states = states.filter(state => state !== comingState).concat(comingState);

        if (comingState === 'home') {
            window.history.replaceState('home', document.title, null);
        } else {
            window.history.replaceState(comingState, comingState, comingState);
        }

        let FromObj = navArray.filter(obj => obj.state === lastState)[0];
        // navArray = navArray.filter(obj => obj.state !== lastState);

        FromObj.from = 'popState_function';
        NavigateBackFrom(FromObj);
    }
};
let NavigateTo = (param) => {

    let comingState = param.state;
    // let lastState = states[states.length - 1];
    if (param.from === 'popState_function') {
        switch (param.type) {
            case 'toggle_button':
                param.value.click();
                break;
            default:
                break;
        }
    } else {
        if (states.indexOf(comingState) !== -1) {
            states = states.filter(state => state !== comingState).concat(comingState);
            window.history.replaceState(comingState, comingState, comingState);
        } else {
            states.push(comingState);
            if (navArray.filter(obj => obj.state === param.state).length === 0) {
                navArray.push(param);
                window.history.pushState(comingState, comingState, comingState);
            }
            window.history.replaceState(comingState, comingState, comingState);
        }
    }
}

let NavigateBackFrom = (FromObj) => {

    if (FromObj.from === 'popState_function') {
        switch (FromObj.type) {
            case 'toggle_button':
                FromObj.value.click();
                break;
            default:
                break;
        }
    } else {
        let lastState = FromObj.state;
        states = states.filter(state => state !== lastState);
        // navArray = navArray.filter(obj => obj.state !== lastState);
        let comingState = states[states.length - 1];

        if (comingState === 'home') {
            console.log('comingState')
            window.history.replaceState('home', document.title, '/');
            console.log(window.history.state);
        } else {
            window.history.replaceState(comingState, comingState, comingState);
        }
    }
}