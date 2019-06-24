import { LightningElement, api, track } from 'lwc';
//Para mostar mensajes
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/** Apex method */
import apexSearch from '@salesforce/apex/VistaController.search';
import crearVisita from '@salesforce/apex/VistaController.crearVisita';
import getVisitById from '@salesforce/apex/VistaController.getVisitById';
export default class FormVisita extends LightningElement {
    @api idVisita;
    @track value;    
    @track radioReq = true;
    @track idDiv;
    @track isMultiEntryR = true;
    @track isMultiEntry = false;
    @track initialSelection = [];
    @track initialSelectionR = [];
    @track errors = [];
    @track errorsR = [];
    pase = 'Identificacion__c';
    responsable = 'Responsable__c';
    iconPase = 'standard:portal_roles';
    iconResp = 'standard:people';

    @track firstName;
    @track apellidos;
    @track email;
    @track fecha;
    @track horaIni;
    @track horaFin;
    @track cel;
    @track tipoId;
    @track ident;
    @track raza;
    @track sexoVisita;
    @track descip;
    @track paseVisita;
    @track idPase = [];
    @track listResp = [];
    @track checkValues = [];
    @track impresion = [];

    //Opciones de los Combobox,Picklist, Radio Buttons
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
        return this.impresion.length ? this.impresion : 'none';
    }

    handleChangeListBox(e) {
        this.impresion = e.detail.value;
    }

    //Obtengo el valor de los input, date, time..
    onNameChange(event) {
        this.firstName = event.target.value;
    }
    onApellidosChange(event) {
        this.apellidos = event.target.value;
    }
    onDiaChange(event) {
        this.fecha = event.target.value;
    }
    onEmailChange(event) {
        this.email = event.target.value;
    }
    onTelChange(event) {
        this.cel = event.target.value;
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
    onTipoIdentChange(event) {
        this.tipoId = event.target.value;
    }
    onRazaChange(event) {
        this.raza = event.target.value;
    }
    onDescChange(event) {
        this.descip = event.target.value;
    }

    onCheckValues(event) {
        //this._checkValues = evt.target.checked;
        if (event.target.checked) {
            this.checkValues.push(event.target.value);
        } else {
            let index = this.checkValues.indexOf(event.target.value);
            if (index > -1) {
                this.checkValues.splice(index, 1);
            }
        }
    }

    onRadioValues(event) {
        this.radioValues = event.target.value;
        this.checkForErrorsRadio();
    }

    handleSelectionChange() {
        this.errors = [];
    }

    handleSelectionChangeR() {
        this.errorsR = [];
    }


    connectedCallback() {
        if (this.idVisita) {
            this.editVisita(this.idVisita);
        }
    }

    editVisita(event) {
        getVisitById({ idVisita: event })
            .then(account => {
                console.log(account);
                this.firstName = account.Name;
                this.apellidos = account.Apellidos__c;
                this.email = account.Email_Visita__c;
                this.fecha = account.Fecha_Visita__c;
                this.horaIni = this.formatTime(account.Hora_Entrada__c);
                this.horaFin = this.formatTime(account.Hora_Salida__c);
                this.cel = account.Telefono__c;
                this.tipoId = account.tipoId__c;
                this.ident = account.CI__c;
                this.raza = account.Raza__c;
                this.sexoVisita = account.Sexo__c;
                this.descip = account.Descripcion__c;
                this.initialSelection = [
                    { id: account.idIdentificacion__c, sObjectType: this.pase, icon: this.iconPase, title: account.idIdentificacion__r.Name }
                ];
                // let test =[account.idIdentificacion__c];              
                this.idPase = [account.idIdentificacion__c];
                account.Rel_Visita_Responsables__r.forEach(element => {
                    let rel = { id: element.idResponsable__r.Id, sObjectType: this.responsable, icon: this.iconResp, title: element.idResponsable__r.Name };
                    this.initialSelectionR.push(rel);
                    this.listResp.push(element.idResponsable__r.Id);
                });
                if (account.Primera_Impresion__c) {
                    this.impresion = account.Primera_Impresion__c.split(',');
                }
                if (account.Pertenecias__c) {
                    this.checkValues = account.Pertenecias__c.split(',');
                }               
            })
            .catch(error => {
                console.error('Lookup error', JSON.stringify(error));
            });
    }

    formatTime(duration) {
        let tiempo = new Date();
        tiempo.setTime(duration);
        return tiempo.toISOString().substring(11, tiempo.toISOString().length - 1);
    }

    //Comprueba que los elemento requeridos estan llenos
    @api
    handleFormValues() {
        const allInputValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        const allComboxValid = [...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        const allRadioValid = [...this.template.querySelectorAll('lightning-radio-group')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        this.checkForErrorsManytoMany();
        this.checkForErrorsLookup();
        this.checkForErrorsRadio();
        if (allInputValid && allComboxValid && allRadioValid && this.errorsLoockup && this.errorsMany && this.radioReq) {
            this.createVisita();
        } else {
            console.log('error ');
        }
    }


    //Chequea los errores en el Loockup
    checkForErrorsLookup() {
        const selectionLoockup = this.template.querySelector('c-lookup-field').getSelection();
        this.idPase = selectionLoockup.map(element => element.id);
        if (selectionLoockup.length === 0) {
            this.errors = [
                { message: 'Este campo es requerido' }
            ];
            this.errorsLoockup = false;
        } else {
            this.errorsLoockup = true;
        }
    }

    //Chequea los errores en el Multiselect
    checkForErrorsManytoMany() {
        const selection = this.template.querySelector('c-multiple-select').getSelectionR();
        this.listResp = selection.map(element => element.id);
        if (selection.length === 0) {
            this.errorsR = [
                { message: 'Este campo es requerido' }
            ];
            this.errorsMany = false;
        } else {
            this.errorsMany = true;
        }
    }

    //Chequea los errores de los radios
    checkForErrorsRadio() {
        if (!this.radioValues) {
            this.radioReq = false;
        } else {
            this.radioReq = true;
        }
    }


    //Creo la visita con los campos llenos
    createVisita() {
        let visitaNew = { 'sobjectType': 'Visita__c' };
        if (this.idVisita) {
            visitaNew.Id = this.idVisita;
        }
        visitaNew.Name = this.firstName;
        visitaNew.Apellidos__c = this.apellidos;
        visitaNew.Fecha_Visita__c = this.fecha;
        visitaNew.Hora_Entrada__c = this.horaIni;
        visitaNew.Hora_Salida__c = this.horaFin;
        visitaNew.CI__c = this.ident;
        visitaNew.Telefono__c = this.cel;
        visitaNew.Email_Visita__c = this.email;
        visitaNew.tipoId__c = this.tipoId;
        visitaNew.Raza__c = this.raza;
        visitaNew.idIdentificacion__c = this.idPase[0];
        visitaNew.Descripcion__c = this.descip;
        visitaNew.Primera_Impresion__c = this.impresion.toString();
        visitaNew.Pertenecias__c = this.checkValues.toString();
        visitaNew.Sexo__c = this.radioValues;
        console.log('editado ' + this.listResp);
        console.log(JSON.parse(JSON.stringify(visitaNew)));
        crearVisita({ visita: visitaNew, responsables: this.listResp })
            .then(account => {
                console.log(account);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'La visita fue salvada correctamente',
                        variant: 'success',
                    }),
                    this.dispatchEvent(new CustomEvent('closewindow'))
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


    //Funcion para relizar la busqueda Loockup, utiliza un metodo en otro LWC.
    handleSearch(event) {
        apexSearch(event.detail)
            .then(results => {
                this.template.querySelector('c-multiple-select').setSearchResults(results);
            })
            .catch(error => {
                this.notifyUser('Lookup Error', 'An error occured while searching with the lookup field.', 'error');
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    //Funcion para relizar la busqueda Juction, utiliza un metodo en otro LWC.  
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






    // STYLE EXPRESSIONS

    get getListBox() {
        return 'slds-p-left_small';
    }

    get getClassRadio() {
        let css = 'slds-form-element ';
        if (!this.radioReq) {
            css += 'slds-has-error';
        } else {
            css = 'slds-form-element ';
        }
        return css;
    }
}