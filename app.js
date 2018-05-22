var map;
var markers = [];
var casinos = [
	{title: "MANDALAY BAY", location: {lat: 36.091958, lng: -115.173114}},
	{title: "BALLAGIO", location: {lat: 36.112953, lng: -115.173062}},
	{title: "PARIS HOTEL", location: {lat: 36.111634, lng: -115.172817}},
	{title: "CAESARS PALACE", location: {lat: 36.117342, lng: -115.173033}},
	{title: "STRATOSPHERE", location: {lat: 36.146373, lng: -115.155745}},
	{title: "LUXOR", location: {lat: 36.095481, lng: -115.173145}},
	{title: "EXCALIBUR", location: {lat: 36.099143, lng: -115.173163}},
	{title: "MGM GRAND", location: {lat: 36.100935, lng: -115.172515}},
	{title: "HARD ROCK", location: {lat: 36.108053, lng: -115.153992}},
	{title: "PLANET HOLLYWOOD", location: {lat: 36.108141, lng: -115.169908}},
	{title: "THE VENETIAN", location: {lat: 36.122082, lng: -115.171392}},
	{title: "PALMS", location: {lat: 36.115440, lng: -115.194811}},
	{title: "RIO", location: {lat: 36.116012, lng: -115.187810}},
	{title: "THE ORLEANS", location: {lat: 36.101018, lng: -115.201611}}
];
var largeInfowindow;

function initMap() {
	//constructor creates a new map - only center and zoom are requred.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 36.0827366, lng: -115.1110119},
		zoom: 13
	});
		
	largeInfowindow = new google.maps.InfoWindow();
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
		
		bounds.extend(marker.position);
		marker.addListener('click', function() {
			populateInfoWindow(this);
		});
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
		casinos[i].marker = marker;
	}
	map.fitBounds(bounds);
}

function populateInfoWindow(marker) {
	//populates the info window
	if (largeInfowindow.marker !=marker) {
		largeInfowindow.marker = marker;
		largeInfowindow.setContent('<div>' + marker.title + '</div>');
		largeInfowindow.open(map, marker);
		largeInfowindow.addListener('closeclick',function(){
			largeInfowindow.marker = null;
			largeInfowindow.close();
		});
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		function getStreetView(data, status) {
			//gets the street view for the info window
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);
					largeInfowindow.setContent('<div>' + marker.title + '</div><div id="pano" class="map-info-window"></div>');
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
				largeInfowindow.setContent('div' + marker.title + '</div>' +
					'<div>No Street View Found</div>');
			}
		}
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		largeInfowindow.open(map, marker);
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
	var self = this;
	self.casinosList = ko.observableArray(casinos);
	self.searchCasinos = ko.observable("");
	var results = [];
	self.filter = ko.computed(function() { 
		console.log(self.searchCasinos()); 
		return ko.utils.arrayFilter(casinosList().toUpperCase(), function() {});
	})
	
	selectClick = function(data,event) {
		console.log(data);
		populateInfoWindow(data.marker);
	}
}

ko.applyBindings(viewModel);