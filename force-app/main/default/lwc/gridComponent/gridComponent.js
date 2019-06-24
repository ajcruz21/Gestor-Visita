import { LightningElement, wire, track } from 'lwc';
//Para refresh el wire
import { refreshApex } from '@salesforce/apex';
//Mostrar un mensaje
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/** Apex method */
import buscarVisita from '@salesforce/apex/VistaController.buscarVisita';
import deleteVisita from '@salesforce/apex/VistaController.deleteVisita';

export default class GridComponent extends LightningElement {    

    @track showModal = false; @track visitas; @track searchTerm = ''; 
    @wire(buscarVisita, { searchTerm: '$searchTerm' })
    loadBears(result) {
        this.visitas = result;
        //console.log(JSON.parse(JSON.stringify(result)));
    }

    //Lanza un evento de nombre bearview
    handleOpenModal() {
        this.showModal = true;
        this.idVisita = null;
    }

    handleCloseModal(event) {
        this.showModal = event.show;
        this.handleRefreshModal();
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

    handleRefreshModal() {
        return refreshApex(this.visitas);
    }

    removeVisita(event) {
        let respuesta = confirm('¿Esta seguro que desea eliminar los datos?');
        if (respuesta) {
            deleteVisita({ idVisita: event.target.value })
                .then(account => {
                    console.log(account);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'La visita fue eliminada correctamente',
                            variant: 'success',
                        }),
                    );
                    return refreshApex(this.visitas);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error eliminando la visita',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
        }
    }

    editVisita(event) {        
        this.idVisita = event.target.value;
        this.showModal = true;      
    }
}