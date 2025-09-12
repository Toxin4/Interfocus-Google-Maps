let map;
let directionService;
let directionRenderer;
let dm;
let routePoints = [];
let mapClickListener;

function iniciarMapa() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: -22.2349,
            lng: -49.9709
        },
        zoom: 14,
        mapId: "teste"
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    dm = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ["polyline", "marker"]
        }
    });

    definirEventos();
    definirSearchBox();
}

function definirEventos() {
    const routeBtn = document.getElementById("route-btn");
    routeBtn.addEventListener("click", () => {
        dm.setMap(null);
        directionsRenderer.setMap(null);
        routePoints = [];

        alert("clique no mapa para desenhar as rotas!")

        if (mapClickListener) {
            google.maps.event.removeListener(mapClickListener)
        }

        mapClickListener = map.addListener("click", (evento) => {
            //desenhar rota com base nos cliques
            adicionarPontoRota(evento.latLng);
        });
    });
}

function adicionarPontoRota(posicao) {
    routePoints.push(posicao);

    if (routePoints.length < 2) return;

    // Define o local de partida
    const origin = routePoints[0];
    //Define o destino
    const destino = routePoints[routePoints.length - 1];
    const waypoints = routePoints.slice(1, -1).map((point) => ({ location: point, stopover: true }));
    const request = {
        origin: origin,
        destination: destino,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (r, s) => {
        if (s === "OK") {
            directionsRenderer.setDirections(r);
            directionsRenderer.setMap(map);
        } else {
            console.error(s, r);
        }
    });
}

let searchMarker = null;

function definirSearchBox() {
    //pega o input de pesquisa
    var search = document.getElementById("search");

    var searchBox = new google.maps.places.Autocomplete(search);

    // fala para o google pesquisar nos limites do mapa (proximo daonde está o mapa)
    searchBox.bindTo("bounds", map);

    searchBox.addListener("place_changed", () => {
        const place = searchBox.getPlace();
        if (!place.geometry){
            console.log("local não encontrado");
            return;
        }

        map.setCenter(place.geometry.location);
        map.setZoom(16);
        
        if (searchMarker) {
            searchMarker.position = place.geometry.location;
        } else {
            var markerContent = document.createElement("div")
            markerContent.style.backgroundColor = "red";
            markerContent.style.color = "white";
            markerContent.style.borderRadius = "50%";
            markerContent.style.height = "50px";
            markerContent.style.width = "50px";
            markerContent.style.fontSize = "16px";
            markerContent.style.fontWeight = "bold";
            markerContent.style.display = "flex";
            markerContent.style.alignContent = "center";

            markerContent.innerHTML = "PESQUISA";
            markerContent.classList.add("marker");


            searchMarker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: place.geometry.location,
                content: markerContent
            });

            // toda vez que clica na bolinha, muda a cor para uma aleatoria
            searchMarker.addListener("click", (event) => {
                markerContent.style.backgroundColor = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
            })
        }
    });
}