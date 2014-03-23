# Google Maps Infowindow with Link to Streetview

Adds ability to go directly to the Street View of a set latitude and longitude using the Google Maps JavaScript API

###<a href="http://labs.traviswilliamson.me/To-Streetview-Link-Google-Maps/" target="_blank" title="Live Demo">Demo</a>

Loads location data (geo coordinates) from js/data.js

## Usage

On document readyCall the myMap.init(mapId) function with the id of your map as the argument.

'''javascript

$(function() {

	myMap.init('map-canvas');

});

'''