var map;
var markers = [];
var casinos = [
	{title: "Mandalay Bay", location: {lat: 36.091958, lng: -115.173114}},
	{title: "Ballagio", location: {lat: 36.112953, lng: -115.173062}},
	{title: "Paris Hotel", location: {lat: 36.111634, lng: -115.172817}},
	{title: "Caesars Palace", location: {lat: 36.117342, lng: -115.173033}},
	{title: "Stratosphere", location: {lat: 36.146373, lng: -115.155745}},
	{title: "Luxor", location: {lat: 36.095481, lng: -115.173145}},
	{title: "Excalibur", location: {lat: 36.099143, lng: -115.173163}},
	{title: "MGM Grand", location: {lat: 36.100935, lng: -115.172515}},
	{title: "Hard Rock", location: {lat: 36.108053, lng: -115.153992}},
	{title: "Planet Hollywood", location: {lat: 36.108141, lng: -115.169908}},
	{title: "The Venetian", location: {lat: 36.122082, lng: -115.171392}},
	{title: "Palms", location: {lat: 36.115440, lng: -115.194811}},
	{title: "Rio", location: {lat: 36.116012, lng: -115.187810}},
	{title: "The Orleans", location: {lat: 36.101018, lng: -115.201611}}
];

function initMap() {
	//constructor creates a new map - only center and zoom are requred.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 36.0827366, lng: -115.1110119},
		zoom: 13
	});
		
	var largeInfowindow = new google.maps.InfoWindow();
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < casinos.length; i++) {
		var position = casinos[i].location;
		var title = casinos[i].title;
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id: i
		});
		markers.push(marker);
		bounds.extend(marker.position);
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}
	map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
	//populates the info window
	if (infowindow.marker !=marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
		infowindow.addListener('closeclick',function(){
			infowindow.marker = null;
			infowindow.close();
		});
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		function getStreetView(data, status) {
			//gets the street view for the info window
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);
					infowindow.setContent('<div>' + marker.title + '</div><div id="pano" class="map-info-window"></div>');
					var panoramaOptions = {
						position: nearStreetViewLocation,
						pov: {
							heading: heading,
							pitch: 30
						}
					};
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions);
			} else {
				infowindow.setContent('div' + marker.title + '</div>' +
					'<div>No Street View Found</div>');
			}
		}
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		infowindow.open(map, marker);
	}
}

function makeMarkerIcon(markerColor) {
	//creates the markers for the casinos
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
	return markerImage;
}

this.hideUnhide = function() {
	var stuff = document.getElementById("sidebar");
	var item = document.getElementById("container")
	if (stuff.style.display === "none") {
		stuff.style.display = "block";
		item.style.display = "block";
	}
	else {
		stuff.style.display = "none";
		item.style.display = "none";
	}
}

var viewModel = function() {
	this.casinosList = ko.observableArray([]);
	initMap();

	for (var i= 0; i < casinos.length; i++) {
		var title = locations[i].title;
		this.casinosList.push(title);
	}
}

ko.applybindings(viewModel);