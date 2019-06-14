import { LightningElement, track } from 'lwc';

export default class HelloWebComponent extends LightningElement {
    @track greeting = 'Trailblazer';

    handleGreetingChange(event) {
        this.greeting = event.target.value;
    }
    currentDate = new Date().toDateString() + ' ' +  new Date().toTimeString();
    get capitalizedGreeting() {
        return `Hello ${this.greeting.toUpperCase()}!`;
    }
}