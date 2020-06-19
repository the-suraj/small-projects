class AnorcleTerm extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log('my-el connected', this);
        console.log(this.getAttribute('def'))
        this.addEventListener('mouseenter', function () {
            alert(this.getAttribute('def'))
        })
    }
    disconnectedCallback() {
        console.log('my-el disconnected');
    }
}
customElements.define('anorcle-term', AnorcleTerm);