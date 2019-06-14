import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
export default class BearMap extends LightningElement {
	@track mapMarkers = [];
    @wire(CurrentPageReference) pageRef; // Required by pubsub
    //Se activa cuando el componte es cargado
	connectedCallback() {
		// subscribe to bearListUpdate event
		registerListener('bearListUpdate', this.handleBearListUpdate, this);
    }
    //Se activa despues que el componente es cargado
	disconnectedCallback() {
		// unsubscribe from bearListUpdate event
		unregisterAllListeners(this);
    }
    //Recive el evento y actualiza los datos en el mapa
	handleBearListUpdate(bears) {
		this.mapMarkers = bears.map(bear => {
			const Latitude = bear.Location__Latitude__s;
			const Longitude = bear.Location__Longitude__s;
			return {
				location: { Latitude, Longitude },
				title: bear.Name,
				description: `Coords: ${Latitude}, ${Longitude}`,
				icon: 'utility:animal_and_nature'
			};
		});
	}
}