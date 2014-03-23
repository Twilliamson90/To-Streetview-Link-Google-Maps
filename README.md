# Google Maps Infowindow with Link to Streetview

Adds ability to go directly to the Street View of a set latitude and longitude using the Google Maps JavaScript API

###<a href="http://labs.traviswilliamson.me/To-Streetview-Link-Google-Maps/" target="_blank" title="Live Demo">Demo</a>

Loads location data (geo coordinates) from js/data.js

## Usage

On document ready, call the init() function with the id of your map as the argument.

```javascript

// include myMap variable from js/main.js

// document ready short cut
$(function() {

  // initialize the map
  // Argument (string): ID of the Google Map element
  myMap.init('map-canvas');
  
});
```