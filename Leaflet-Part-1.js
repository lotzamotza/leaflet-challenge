//Store JSON file
var URLdata = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

//Retrieve data from JSON
d3.json(URLdata).then(function(data) {
    console.log(data);
    createFeatures(data.features);
});

//Size of markers
function markerSize(magnitude) {
    return magnitude * 10
};

//Marker color for depth
function chooseColor(depth) {
    if (depth < 10) return 'yellow';
    else if (depth < 30) return 'lightgreen';
    else if (depth < 50) return 'limegreen';
    else if (depth < 70) return 'green';
    else if (depth < 90) return '#001a00';
    else return 'darkred';
}

function createFeatures(earthquakeData) {
    //function for running features & display metadata
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    //Layer for GeoJSON
    var earthquake = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        
        pointToLayer: function(feature, latlng) {
            //marker style
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.8,
                color: 'black',
                stroke: true,
                weight: 0.5
            }
            return L.circle(latlng, markers);
        }
    });

    //create the map
    createImageBitmap(earthquake);
}

function createMap(earthquake) {
    //Make tile layer
    var grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 20,
        zoomOffset: -1,
        style: 'mapbox/light-v11'
    });

    //create the map
    var earthMap = L.map('map', {
        center: [
            54.5260, -105.2551
        ],
        zoom: 4.2,
        layers: [grayscale, earthquake]
    });

    //display legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(){
        var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += '<h3 style="text-align: center">Depth</h3>'

        for (var i=0; i < depth.length; i ++) {
            div.innerHTML +=
            '<i style="background:"' + chooseColor(depth[i] + 1) + '"></i>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(earthMap)
};