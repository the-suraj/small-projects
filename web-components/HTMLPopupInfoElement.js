class HTMLPopupInfoElement extends HTMLElement {
    constructor() {
        /* Always call super first in constructor */
        super();

        //...
        this.initialized = false;
        // const shadow = this.attachShadow({mode: 'open'});

        console.log(this);

        // this.appendChild(div);
    }
    connectedCallback() {
        if (!this.initialized) {
            this.initialized = true;
            console.log('[FROM: connectedCallback]: HTMLPopupInfoElement Linked');

            //...
            // this.style.position = 'relative';
            this.style.backgroundColor = 'yellow';
            
            //...
            const div = document.createElement('div');
            this.addEventListener('mouseenter', async function () {
                if (!div.innerText) {
                    div.innerText = await (await fetch(this.getAttribute('info'))).text();
                }
                if (this.displayTimeOut) {
                    clearTimeout(this.displayTimeOut);
                }
                div.style.display = 'block';
            })
            this.addEventListener('mouseleave', function () {
                if (this.displayTimeOut) {
                    clearTimeout(this.displayTimeOut);
                }
                this.displayTimeOut = setTimeout(() => {
                    div.style.display = 'none';
                }, 150);
            })
            div.style.cssText = `
                outline: 1px solid red;
                position: absolute;
                background-color: white;
                display: none;
            `;
            this.appendChild(div);
        }
        else if (this.isConnected) {
            console.log("[FROM: connectedCallback]: HTMLPopupInfoElement moved");
        }
        else {
            console.log("[FROM: connectedCallback]: unindentified Case");
        }

    }
    disconnectedCallback() {
        if (this.isConnected) {
            console.log("[FROM: disconnectedCallback]: HTMLPopupInfoElement moved");
        } else {
            console.log('HTMLPopupInfoElement Unlinked');
        }
    }
}
customElements.define('popup-info', HTMLPopupInfoElement);