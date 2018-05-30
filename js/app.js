var map;
var markers = [];
var marker;
var casinos = [
	{title: "MANDALAY BAY", location: {lat: 36.091958, lng: -115.173114},isselected: ko.observable(false),wiki: "Mandalay_Bay"},
	{title: "BALLAGIO", location: {lat: 36.112953, lng: -115.173062},isselected: ko.observable(false),wiki: "Bellagio_(resort)"},
	{title: "PARIS HOTEL", location: {lat: 36.111634, lng: -115.172817},isselected: ko.observable(false), wiki: "Paris_Las_Vegas"},
	{title: "CAESARS PALACE", location: {lat: 36.117342, lng: -115.173033},isselected: ko.observable(false), wiki: "Caesars_Palace"},
	{title: "STRATOSPHERE", location: {lat: 36.146373, lng: -115.155745},isselected: ko.observable(false), wiki: "Stratosphere Las Vegas"},
	{title: "LUXOR", location: {lat: 36.095481, lng: -115.173145},isselected: ko.observable(false), wiki: "Luxor_Las_Vegas"},
	{title: "EXCALIBUR", location: {lat: 36.099143, lng: -115.173163},isselected: ko.observable(false), wiki: "Excalibur_Hotel_and_Casino"},
	{title: "MGM GRAND", location: {lat: 36.100935, lng: -115.172515},isselected: ko.observable(false), wiki: "MGM_Grand_Las_Vegas"},
	{title: "HARD ROCK", location: {lat: 36.108053, lng: -115.153992},isselected: ko.observable(false), wiki: "Hard_Rock_Hotel_and_Casino_(Las_Vegas)"},
	{title: "PLANET HOLLYWOOD", location: {lat: 36.108141, lng: -115.169908},isselected: ko.observable(false), wiki: "Planet_Hollywood_Las_Vegas"},
	{title: "THE VENETIAN", location: {lat: 36.122082, lng: -115.171392},isselected: ko.observable(false), wiki: "The_Venetian_Las_Vegas"},
	{title: "PALMS", location: {lat: 36.115440, lng: -115.194811},isselected: ko.observable(false), wiki: "Palms_Casino_Resort"},
	{title: "RIO", location: {lat: 36.116012, lng: -115.187810},isselected: ko.observable(false), wiki: "Rio_All_Suite_Hotel_and_Casino"},
	{title: "THE ORLEANS", location: {lat: 36.101018, lng: -115.201611},isselected: ko.observable(false), wiki: "The_Orleans"}
];
var largeInfowindow;

function initMap() {
	//constructor creates a new map - only center and zoom are requred.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 36.0827366, lng: -115.1110119},
		zoom: 13
	});
		
	largeInfowindow = new google.maps.InfoWindow();
	//creates new Infowindow
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < casinos.length; i++) {
		//loads the casinos into an array
		var position = casinos[i].location;
		var title = casinos[i].title;
		marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id: i,
			wiki: casinos[i].wiki
		});
		
		bounds.extend(marker.position);
		marker.addListener('click', function() {
			populateInfoWindow(this);
			toggleBounce(this);
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
		
		var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=' + marker.wiki + 
			'&origin=*';
		
		$.ajax({
			url: wikiUrl,
			type: "GET",
			dataType: "json",
			success: getWiki,
			error: function() {
				alert('Wikipedia failed to load');
			}
			 
		});
		
		function getWiki(data, status) {
			var pages = data.query.pages;
			var source = pages[Object.keys(pages)[0]].original.source;
			
			largeInfowindow.marker = marker;
			largeInfowindow.setContent('<div class="map-info-window">' + marker.title + '</div>' + '<hr>' + '<div>' + '<img src= "' + source +
				 '" height="350px" width="400px">' + '</div>' + '<div>' + 'Image From Wikipedia: https://en.wikipedia.org/wiki/' + marker.wiki + '</div>');
			largeInfowindow.addListener('closeclick',function(){
				largeInfowindow.marker = null;
				largeInfowindow.close();
			});

					
			largeInfowindow.open(map, marker);
		}
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
	//Hides and unhides the List box
	var stuff = document.getElementById("sidebar");
	var item = document.getElementById("container");
	if (stuff.style.display === "none") {
		stuff.style.display = "block";
		item.style.display = "block";
	}
	else {
		stuff.style.display = "none";
		item.style.display = "none";
	}
};

toggleBounce = function(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
	window.setTimeout(function() {
		marker.setAnimation(null);
	}, 3000);
};

var viewModel = function() {
	var self = this;
	var locationholder;
	self.casinosList = ko.observableArray(casinos);
	self.searchCasinos = ko.observable("");
		
	self.filter = ko.computed(function() { 
		//Filter Casinos by searching
		var term = self.searchCasinos().toLowerCase();
		return ko.utils.arrayFilter(self.casinosList(), function (item) {
			var isvisible =  item.title.toLowerCase().startsWith(term);
			if (item.marker) {
				item.marker.setVisible(isvisible);
			} 
			return (isvisible);
		});
	});

	selectClick = function(data,event) {
		//Opens Infowindow when casino is selected from list
		if (locationholder) {
			locationholder.isselected(false);
		}
		locationholder = data;
		toggleBounce(data.marker);
		populateInfoWindow(data.marker);
		data.isselected(true);
	};
};

function GoogleError() {
	alert('GoogleMaps did not load. Please try again.');
}

ko.applyBindings(viewModel);