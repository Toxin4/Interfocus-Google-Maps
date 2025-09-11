let map;
let directionService;
let directionRenderer;

function iniciarMapa() {
    map = new google.maps.Map(document.getElementById("map"),{
        center: {
            lat: -22.2349,
            lng: -49.9709
        },
        zoom: 14
    })
}