import { LightningElement, wire, track } from 'lwc';
import buscarVisita from '@salesforce/apex/VistaController.buscarVisita';
export default class GridComponent extends LightningElement {

    @track showModal = false; @track visitas; @track searchTerm = '';
    @wire(buscarVisita, { searchTerm: '$searchTerm'})
    loadBears(result) {
        this.visitas = result;
    }

    //Lanza un evento de nombre bearview
    handleOpenModal() {
        this.showModal = true;
    }

    handleCloseModal(event){       
        this.showModal = event.show;
    }

    handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}

}