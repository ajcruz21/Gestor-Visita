import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    @api idVisita;
    
    handleCerrarModal() {
        const closeModal = new CustomEvent('closemodal', {
            show: false
        });
        this.dispatchEvent(closeModal);
    }

    handleChekAddValues() {
        const returnValue = this.template.querySelector('c-form-visita').handleFormValues('new');
        console.log(returnValue)
    }

    handleChekEditValues() {
        const returnValue = this.template.querySelector('c-form-visita').handleFormValues('new');
        console.log(returnValue)
    }

    get getCloseButton() {
        let css = 'slds-button slds-modal__close';
        return css;
    }

}