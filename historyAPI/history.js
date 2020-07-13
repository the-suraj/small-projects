class NavigationObserver {
    constructor() {
        this.currentID = 0;
        this.elementsUnderObservation = [];
        this.stateList = [];

        let url = setObjectAsQueryString("state" + this.stateList);

        window.history.replaceState(this.stateList, null, url);
        return this;
    }
    /**
     * 
     */
    addAction(targetElement, callback) {
        targetElement.currentState = "active";

        console.log("[Function addAction]:", targetElement, callback);
        console.info("[history.length]", history.length)
        this.stateList.push(targetElement.uuid)

        window.history.pushState(this.stateList, null, setObjectAsQueryString("state", this.stateList));
        callback();
    }
    removeAction(targetElement, callback) {
        targetElement.currentState = "inactive";
        
        const index = this.stateList.indexOf(targetElement.uuid);
        console.log(index);
        if (index > -1) {
            const stateTimeLine = this.stateList.slice(0, index);
            this.stateList.splice(index, 1);
            history.replaceState(stateTimeLine, null, setObjectAsQueryString("state", stateTimeLine));
            for (let i = index; i < this.stateList.length; i++) {
                stateTimeLine.push(this.stateList[i]);
                window.history.pushState(stateTimeLine, null, setObjectAsQueryString("state", stateTimeLine));
            }
        }
        callback();
    }
    redoAction() { }
    undoAction() { }
    preserveState(comingState) {
        console.log("[Preserve State]:", comingState);
        if (comingState.length < navigationObserver.stateList.length) {
            // preserve Back
            const toDeactivate = navigationObserver.stateList.slice(comingState.length);
            console.log("[Deactivate]: ", toDeactivate)
            toDeactivate.forEach(uuid => {
                this.removeAction(
                    this.elementsUnderObservation.filter(elm => elm.uuid === uuid)[0],
                    this.elementsUnderObservation.filter(elm => elm.uuid === uuid)[0].hide
                );
            })
        } else {
            // preserve forward
            const toActivate = comingState.slice(navigationObserver.stateList.length);
            console.log("[Activate]: ", toActivate);
            toActivate.forEach(uuid => {
                this.stateList.push(uuid);
                this.elementsUnderObservation.filter(elm => elm.uuid === uuid)[0].show();
            })
        }
    }


    /**
     * 
     * @function handle
     * @param {HTMLElement} element 
     * @param {String} trigerEvent 
     * @param {Object} callbackObject
     */
    handle(targetElement, { toShow, toHide, currentState }) {
        targetElement.currentState = currentState;
        targetElement.show = toShow.callback;
        targetElement.hide = toHide.callback;
        targetElement.uuid = `obe${this.currentID += 1}`;
        this.elementsUnderObservation.push(targetElement);

        if (currentState === 'active') {
            this.addAction(targetElement, toShow.callback);
        }

        var observationTargets = {
            common: [],
            onlyShow: [],
            onlyHide: []
        }

        toShow.observableActions.forEach(observationTargetForShow => {
            toHide.observableActions.forEach(observationTargetForHide => {
                const isCommon = observationTargetForShow.element === observationTargetForHide.element &&
                    observationTargetForShow.action === observationTargetForHide.action
                if (isCommon) {
                    observationTargets.common.push(observationTargetForHide);
                } else {
                    observationTargets.onlyShow.push(observationTargetForShow);
                    observationTargets.onlyHide.push(observationTargetForHide);
                }
            });
        });
        observationTargets.common.forEach(observationTarget => {
            observationTarget.element.addEventListener(observationTarget.action, () => {
                if (targetElement.currentState === "inactive") {
                    this.addAction(targetElement, toShow.callback);
                }
                else {
                    this.removeAction(targetElement, toHide.callback);
                }
            })
        })
        observationTargets.onlyShow.forEach(observationTarget => {
            observationTarget.element.addEventListener(observationTarget.action, () => {
                this.addAction(targetElement, toShow.callback);
            })
        })
        observationTargets.onlyHide.forEach(observationTarget => {
            observationTarget.element.addEventListener(observationTarget.action, () => {
                this.removeAction(targetElement, toHide.callback);
            })
        })
    }
}

window.onpopstate = function (event) {
    if (event.state) {
        if (event.state.length < navigationObserver.stateList.length) {
            navigationObserver.preserveState(event.state);
        } else {
            navigationObserver.preserveState(event.state);
        }
        console.log('[Event Pop State]: ', event.state, "navigationObserver.stateList", navigationObserver.stateList)
    }
}
function setObjectAsQueryString(queryName, obj) {

    const query = queryName + "=" + encodeURIComponent(btoa(JSON.stringify(obj)))
    let url;

    // valid query string exists
    if (/\?([\w\d\s%]*)=([\w\d\s%]*)/.test(window.location.search)) {

        // State Parameter exists
        if (/state=([\w\d\s%]*)/.test(window.location.search)) {
            url = window.location.href.replace(/state=([\w\d\s%]*)/, query)
        }
        // State Parameter doesn't exists
        else {
            url = window.location.origin +
                window.location.pathname +
                window.location.search +
                "&" + query +
                window.location.hash
        }
    }
    // valid query string doesn't exists
    else {
        url = window.location.origin +
            window.location.pathname +
            "?" + query +
            window.location.hash
    }
    return url;
}
window.navigationObserver = new NavigationObserver();