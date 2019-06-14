import { LightningElement } from 'lwc';

export default class Modal extends LightningElement {

    handleCerrarModal() {
        const closeModal = new CustomEvent('closemodal', {
            show: false
        });
        this.dispatchEvent(closeModal);
    }

    handleChekValues() {
        const returnValue = this.template.querySelector('c-form-visita').handleFormValues('My param');   
        console.log(returnValue)
    }

}