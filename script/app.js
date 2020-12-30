let mapa;
let markers = [];
let fichero = 'centrosEduacionMadrid.json';
let data;

window.onload = function () {
	initMap();
	cargarFichero(fichero);
};

// Cargamos los datos vía AJAX

function cargarFichero(fichero) {
	let xhr = new XMLHttpRequest();
	let datos;
	xhr.open('GET', fichero, true);

	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			datos = JSON.parse(this.responseText);
			initMap();
			colocarPines(datos);
		}
	};
	xhr.send();
}

function initMap() {
	const LatLong = {
		lat: 40.4165,
		lng: -3.70256
	};
	//console.log(latLng);
	this.mapa = new google.maps.Map(document.getElementById('mapa'), {
		center: LatLong,
		zoom: 12.5
	});

	return;
}

// Colocamos lo pines
function colocarPines(data) {
	let lat;
	let lng;
	let nombre;
	let descripcion;
	let infoWindowActivo;

	// patron es lo que hay que modificar
	let patron = "Centro de Educación de Personas Adultas (CEPA)";

	/********************** */

	// Definimos el tipo de icono
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
	var icons = {
		capital: {
			name: 'capital',
			icon: iconBase + 'capital_big_highlight.png'
		}
	}; 
	//console.log(data);
	console.log(patron.length);

	// Recorremos la data
	data.forEach(element => {
		//console.log(element.title);

		// Si existe la localizacion y además coincide con el patrón buscado lo mostramos

		if (element.location !== undefined && element.title.substring(0,46) == patron) {
			console.log(element.title);

			// Recogemos las coordenadas
			lat = element.location.latitude;
			lng = element.location.longitude;
			nombre = element.title;

			// Lo colocamos en notación europea

			if (lat != null || lng != null) {
				lat = lat.toString().replace(",", ".");
				lng = lng.toString().replace(",", ".");
			}

			//Coordenadas del punto
			const coordenadas = {
				lat: Number(lat),
				lng: Number(lng),
			};

			let icono = icons[coordenadas.tipo];
			if (icono !== undefined) {
				icono = icono.icon;
			}

			// Colocamos el pi
			let marker = new google.maps.Marker({
				position: coordenadas,
				map: this.mapa,
				icon: icono,
			});
			markers.push(marker);

			// Asociamos una ventana de información
			let infoWindow = crearInfoWindow(
				nombre
			);

			marker.addListener("click", () => {
				if (infoWindowActivo) {
					infoWindowActivo.close();
				}

				infoWindow.open(this.mapa, marker);
				infoWindowActivo = infoWindow;
			});
		}
	});
	return;
}

function crearInfoWindow(nombre) {
	let markerInfo = `<h4>${nombre}</h4> 
        `;

	infoWindow = new google.maps.InfoWindow({
		content: markerInfo
	});

	return infoWindow;
}