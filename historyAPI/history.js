// this value will be set to true when we will update history records with javascript
// and will be used to avoid handling popstate event because of that.
let updatingHistory = false;
class NavigationObserver {
    constructor() {
        this.currentID = 0;
        this.elementsUnderObservation = [];
        this.stateList = ["Home"];
        this.statePointer = 0;

        history.replaceState("Home", null, "?state=Home");
        return this;
    }
    /**
     * 
     */
    addAction(targetElement, callback, event) {
        if (callback(event)) {
            targetElement.currentState = "active";

            // console.log("[Function addAction]:", targetElement, callback);
            // console.info("[history.length]", history.length)

            const index = this.stateList.indexOf(history.state)
            this.stateList.splice(index + 1)
            this.stateList.push(targetElement.uuid)
    
            history.pushState(targetElement.uuid, null, `?state=${targetElement.uuid}`);
        }
    }
    removeAction(targetElement, callback, event) {
        // console.log(index);
        if (callback(event)) {
            updatingHistory = true

            targetElement.currentState = "inactive";
            const index = this.stateList.indexOf(targetElement.uuid);

            if (index > -1) {
                history.go(index - this.stateList.length)
                this.stateList.splice(index, 1);

                const addRecords = () => {
                    if (history.state === this.stateList[index - 1]) {
                        for (let i = index; i < this.stateList.length; i++) {
                            history.pushState(this.stateList[i], null, `?state=${this.stateList[i]}`);
                        }
                        clearInterval(interval)
                    }
                }
                const interval = setInterval(addRecords, 100);
                
            }
            
            setTimeout(() => {
                updatingHistory = false
            }, this.stateList.length * 10);
        }
    }
    redoAction() { }
    undoAction() { }
    preserveState(comingState) {
        // console.log("[Preserve State]: Coming State:", comingState);
        const index = this.stateList.indexOf(comingState);

        // back logic
        if (index !== -1) {
            for (let i = index + 1; i < this.stateList.length; i++) {
                const uuid = this.stateList[i]
                const elm = this.elementsUnderObservation.filter(elm => elm.uuid === uuid)[0]
                if (elm && elm.currentState === "active") {
                    elm.currentState = "inactive"
                    elm.hide()
                }
            }
        }

        for (let i = 0; i <= index; i++) {
            const uuid = this.stateList[i]
            const elm = this.elementsUnderObservation.filter(elm => elm.uuid === uuid)[0]
            if (elm && elm.currentState === "inactive") {
                elm.currentState = "active"
                elm.show()
            }
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

        toShow.observableActions.forEach(showRec => {
            toHide.observableActions.forEach(hideRec => {
                const isCommon = showRec.element === hideRec.element && showRec.action === hideRec.action
                if (isCommon) {
                    observationTargets.common.push(hideRec);
                } else {
                    observationTargets.onlyShow.push(showRec);
                    observationTargets.onlyHide.push(hideRec);
                }
            });
        });

        observationTargets.common.forEach(record => {
            record.element.addEventListener(record.action, (event) => {
                if (targetElement.currentState === "inactive") {
                    this.addAction(targetElement, toShow.callback, event);
                }
                else {
                    this.removeAction(targetElement, toHide.callback, event);
                }
            })
        })
        observationTargets.onlyShow.forEach(record => {
            record.element.addEventListener(record.action, (event) => {
                this.addAction(targetElement, toShow.callback, event);
            })
        })
        observationTargets.onlyHide.forEach(record => {
            record.element.addEventListener(record.action, (event) => {
                this.removeAction(targetElement, toHide.callback, event);
            })
        })
    }
}

onpopstate = function (event) {
    const comingState = event.state;
    if (comingState && updatingHistory === false) {
        
    console.log(`
    Coming State: ${comingState},
    StateList: ${String(navigationObserver.stateList)}
    `);

        navigationObserver.preserveState(comingState);
    }
}
navigationObserver = new NavigationObserver();