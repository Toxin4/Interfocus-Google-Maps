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
        zoom: 14
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

    const origin = routePoints[0];
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
    })

}