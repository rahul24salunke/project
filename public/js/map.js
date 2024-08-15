
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: List.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const marker= new mapboxgl.Marker()
    .setLngLat(List.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25}).setHTML(
            `<h4>${List.location}</h4><p>Exact location provided after booking</p>`
        )
    )
    .addTo(map);