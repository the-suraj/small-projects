const moreBtnArray = Array.from(document.getElementsByClassName("more-btn"));
const moreTextArray = Array.from(document.getElementsByClassName("more-text"));

/**
 * 
 * @param {HTMLDivElement} moreText 
 */
const toggleDisplay = (moreText) => {
    if (moreText.style.display !== 'none') {
        moreText.style.display = "none";
    } else {
        moreText.style.display = "block";
    }
}
window.onload = () => {
    moreBtnArray.forEach((moreBtn, index) => {

        /**
        * @param {HTMLDivElement} moreText 
        */
        const showText = () => {
            moreTextArray[index].style.display = "block";
            return true
        }

        /**
         * @param {HTMLDivElement} moreText 
         */
        const hideText = () => {
            moreTextArray[index].style.display = "none";
            return true
        }

        navigationObserver.handle(moreTextArray[index], {
            toShow: {
                observableActions: [
                    { element: moreBtn, action: 'click' }
                ],
                callback: showText
            },
            toHide: {
                observableActions: [
                    { element: moreBtn, action: 'click' }
                ],
                callback: hideText
            },
            currentState: 'inactive' || 'active'
        })
    });
}