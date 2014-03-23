// revealing module pattern

var myMap = function() {

	var	options = {
		zoom: 4,
		center: new google.maps.LatLng(38.810821,-95.053711),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	// :: Public Function ::
	function init(mapId) {
		map = new google.maps.Map(document.getElementById(mapId), options);
		loadLocationMarkers();
	}

	/*
		== MARKERS ==
	*/

	function loadLocationMarkers() {
		for( i=0; i < locationData.length; i++ ) {
			var lat =  locationData[i].lat,
				lng = locationData[i].lng;

			var infoWindow = new google.maps.InfoWindow({
				maxWidth: 400
			});
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( lat, lng ),
				map: map,
				icon: 'img/red-fat-marker.png',
				title: locationData[i].street
			});
			var content = ['<div class="iw"><span class="title">', locationData[i].street, '</span>',
				'<br><i class="fa fa-map-marker"></i><span class="desc">', locationData[i].cityState, '</span>',
				'<br><i class="fa fa-road"></i><a href="#" class="desc" onClick="myMap.getSv(', lat, ',', lng, ')">Street View &raquo;</a></div>'].join('');
			
			google.maps.event.addListener(marker, 'click', (function (marker, content) {
				return function() {
					infoWindow.setContent(content);
					infoWindow.open(map, marker);
				}
			})(marker, content));
		}
	}

	/*
		== STREET VIEW ==
	*/

	// :: Public Function ::
	function streetView(lat, lng) {
		var distance = 150,
			sv = new google.maps.StreetViewService();
		
		svLatLng = new google.maps.LatLng(lat, lng);
		sv.getPanoramaByLocation(svLatLng, distance, processSVData);
	}
	
	function processSVData(data, status) {
		if (status == google.maps.StreetViewStatus.OK) {
			var svPos = data.location.latLng;
			var heading = google.maps.geometry.spherical.computeHeading(svPos, svLatLng);
			panorama = map.getStreetView();
			panorama.setPosition(svPos);
			panorama.setPov(({
				heading: heading,
				pitch: 0
			}));
			
			panorama.setVisible(true);
			toggleSvBtn();
		} else {
			alert('Street view is unavailable');
		}
	}	

	return {
		init: init,
		getSv: streetView
	};
}();


$(function() {

	// takes ID of map in document
	myMap.init('map-canvas');

});





