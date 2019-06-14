import { LightningElement, api, track } from 'lwc';
//import VISITA_OBJECT from '@salesforce/schema/Visita__c';
import crearVisita from '@salesforce/apex/VistaController.crearVisita';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/** SampleLookupController.search() Apex method */
import apexSearch from '@salesforce/apex/VistaController.search';
/*const fields = [
	'Visita__c.Name',
	'Visita__c.Apellidos__c',
    'Visita__c.Descripcion__c',
    'Visita__c.Email_Visita__c',
    'Visita__c.Fecha_Visita__c',
    'Visita__c.Hora_Entrada__c',
    'Visita__c.Hora_Salida__c',
    'Visita__c.Raza__c',
    'Visita__c.Sexo__c',
    'Visita__c.Telefono__c',
    'Visita__c.CI__c',
    
];*/

export default class FormVisita extends LightningElement {
    @track firstName; @track apellidos; @track fecha; @track horaIni; @track horaFin; @track ident;
    @track value = ['Pasaporte'];
    @track _selected = [];

    get optionsTipoId() {
        return [
            { label: 'Pasaporte', value: 'Pasaporte' },
            { label: 'Cédula', value: 'Cédula' },
            { label: 'Otro', value: 'Otro' },
        ];
    }

    get optionsRaza() {
        return [
            { label: 'Blanca', value: 'Blanca' },
            { label: 'Negra', value: 'Negra' },
            { label: 'Mestiza', value: 'Mestiza' },
        ];
    }
    //Opcion 
    get optionsImpresion() {
        return [
            { label: 'Nervioso', value: 'Nervioso' },
            { label: 'Sospechoso', value: 'Sospechoso' },
            { label: 'Inseguro', value: 'Inseguro' },
            { label: 'Confiado', value: 'Confiado' },
            { label: 'Respetuoso', value: 'Respetuoso' },
            { label: 'Amable', value: 'Amable' },
            { label: 'Humilde', value: 'Humilde' },
            { label: 'Arrogante', value: 'Arrogante' },
            { label: 'Alegre', value: 'Alegre' }
        ];
    }

    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }   
    

    @api
    handleFormValues() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            this.createVisita();
        } else {
            console.log('error ');
        }
    }

    onNameChange(event) {
        this.firstName = event.target.value;
    }
    onApellidosChange(event) {
        this.apellidos = event.target.value;
    }
    onDiaChange(event) {
        this.fecha = event.target.value;
    }
    onHoraIniChange(event) {
        this.horaIni = event.target.value;
    }
    onHoraFinChange(event) {
        this.horaFin = event.target.value;
    }
    onIdentChange(event) {
        this.ident = event.target.value;
    }

    createVisita() {
        let visitaNew = { 'sobjectType': 'Visita__c' };
        visitaNew.Name = this.firstName;
        visitaNew.Apellidos__c = this.apellidos;
        visitaNew.Fecha_Visita__c = this.fecha;
        visitaNew.Hora_Entrada__c = this.horaIni;
        visitaNew.Hora_Salida__c = this.horaFin;
        visitaNew.CI__c = this.ident;

        crearVisita({ visita: visitaNew })
            .then(account => {
                console.log(account);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'La visita fue correctamente creada',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creando la visita',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    @api notifyViaAlerts = false;
    pais = 'Pais__c';
    iconPais = 'standard:channel_programs';
    pase = 'Identificacion__c';
    iconPase = 'standard:portal_roles';
    pais = 'Pais__c';
    iconPais = 'standard:channel_programs';
    responsable = 'Responsable__c';
    iconResp = 'standard:people';
    @track idDiv;
    @track isMultiEntryR = true;
    @track isMultiEntry = false;
    @track initialSelection = [];
    @track initialSelectionR = [];
    @track errors = [];

    handleSearch(event) {      
        apexSearch(event.detail)
            .then(results => {   
                this.template.querySelector('c-lookup-field-multiple').setSearchResults(results);
            })
            .catch(error => {
                this.notifyUser('Lookup Error', 'An error occured while searching with the lookup field.', 'error');
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    handleSearchS(event) {      
        apexSearch(event.detail)
            .then(resul => {   
                this.template.querySelector('c-lookup-field').setSearchResul(resul);
            })
            .catch(error => {
                this.notifyUser('Lookup Error', 'An error occured while searching with the lookup field.', 'error');
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    handleSelectionChange() {
        this.errors = [];
    }

    handleSubmit() {
        this.checkForErrors();
        if (this.errors.length === 0) {
            this.notifyUser('Success', 'The form was submitted.', 'success');
        }
    }

    checkForErrors() {
        const selection = this.template.querySelector('c-lookup').getSelection();
        if (selection.length === 0) {
            this.errors = [
                { message: 'You must make a selection before submitting!' },
                { message: 'Please make a selection and try again.' }
            ];
        } else {
            this.errors = [];
        }
    }

    notifyUser(title, message, variant) {
        if (this.notifyViaAlerts){
            // Notify via alert
            // eslint-disable-next-line no-alert
            alert(`${title}\n${message}`);
        } else {
            // Notify via toast
            const toastEvent = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(toastEvent);
        }
    }
}