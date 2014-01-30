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
				icon: 'img/green-marker.png',
				title: locationData[i].street
			});
			var content = '<div class="iw"><span class="title">' + locationData[i].street + '</span>' +
				'<br><i class="fa fa-map-marker"></i><span class="desc">' + locationData[i].cityState + '</span>' +
				'<br><i class="fa fa-road"></i><a href="#" class="desc" onClick="myMap.getSv('+ lat +','+ lng +')">Street View &raquo;</a></div>';
			
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
	
	/*
		== CURRENT LOCATION ==
	*/
	
	function getGeoSuccess(position) {
		var s = document.querySelector('#status');
		
		if (s.className == 'success') {
			// hack for FF   
			return;
		}
		s.className = 'success';
		
		var infoWindow = new google.maps.InfoWindow({ maxWidth: 400 });
		
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		var marker = new google.maps.Marker({
			position: latLng, 
			map: map,
			icon: 'img/blue-marker.png',
			animation: google.maps.Animation.DROP,
			title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
		});
		
		if( position.coords.accuracy > 1609.34 ) {
			accuracyImperial = Math.round( (position.coords.accuracy * 0.000621371) * 10)/10 + ' mi.';
		} else {
			accuracyImperial = Math.round( (position.coords.accuracy * 3.28084) * 10)/10 + ' ft.';
		}
		
		var content = 'My location<hr>' +
					'<strong>Latitude:</strong> ' + position.coords.latitude +
					'<br><strong>Longitude:</strong> ' + position.coords.longitude +
					'<br><strong>Accuracy:</strong> ' + accuracyImperial;
		
		google.maps.event.addListener(marker, 'click', (function (marker, content) {
			return function() {
				infoWindow.setContent(content);
				infoWindow.open(map, marker);
			}
		})(marker, content));
	}
	
	function getGeoError(msg) {
		var s = document.querySelector('#status');
		s.innerHTML = typeof msg == 'string' ? msg : 'Failed: ' + msg;
		s.className = 'fail';
		alert('Failed to locate your position. If you\'re on a device that should support geolocation (eg. iPad) it could be disabled in your privacy settings (Settings -> Privacy -> Location Services)');
	}
	
	// :: Public Function ::
	function getGeoLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getGeoSuccess, getGeoError);
		} else {
			error('not supported');
		}
	}

	// next 2 functions are for the close button

	// :: Public Function ::
	function closeSv() {
		panorama.setVisible(false);
		toggleSvBtn();
	}

	// close button display
	function toggleSvBtn() {
		var btn = $('#close');
		if( btn.css('visibility') === 'visible' ) {
			btn.css('visibility', 'hidden');
		} else {
			btn.css('visibility', 'visible');
		}
	}

	return {
		init: init,
		getSv: streetView,
		getGeoLocation: getGeoLocation,
		closeSv: closeSv
	};
}();


$(function() {

	// takes ID of map in document
	myMap.init('map-canvas');

	// allows for both close buttons to function properly (listens to Google Maps close button)
	$('#map-canvas').on('click', '[title="Exit Street View"]', function() {
		myMap.closeSv();
	});

	$('.load-btn').on('click', function() {
		var $this = $(this);
		$('select').val(0);
		myMap.resetFilter();
		myMap.getPeople();

		if( $this.hasClass('is-success') ) {
			$this.removeClass('is-success').addClass('is-default');
		}
	});

	$('.followers-select').on('change', function(e) {
		//console.log(this.value);
		//console.log(e);
		myMap.filterCtrl('followers', this.value);
	});

	$('.college-select').on('change', function() {
		myMap.filterCtrl('college', this.value);
	});

	$('.from-select').on('change', function() {
		myMap.filterCtrl('from', this.value);
	});
	
	$('.get-location').on('click', function() {
		myMap.getGeoLocation();
		$(this).removeClass('is-primary').addClass('is-default');
	});
});





