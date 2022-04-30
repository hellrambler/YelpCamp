

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 20
        })
        .setHTML(
            `<strong>${campground.title}</strong><p>${campground.location}</p>`
        )
    )
    .addTo(map);
