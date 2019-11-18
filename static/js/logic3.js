var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

d3.json(earthquakeUrl, function(data) {
  console.log(data)
  Features(data.features);
});

function Features(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: Sizes(feature.properties.mag),
        fillColor: Colors(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var firstMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var secondMaps = {
    Earthquakes: earthquakes
  };

  var Map = L.map("map", {
    center: [
      
        40.22, -74.75
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(firstMaps, secondMaps, {
    collapsed: false
  }).addTo(Map);



var legend = L.control({ position: 'bottomright'});


  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0,1,2,3,4,5,6],
        labels = [];

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Colors(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(Map);
  };


function Colors(magnitude) {

    switch (true) {
      case magnitude >= 6.0:
        return 'red';
        break;
      
      case magnitude >= 5.0:
        return 'orangered';
        break;

      case magnitude >= 4.0:
        return 'darkorange';
        break;
      
      case magnitude >= 3.0:
        return 'orange';
        break;

      case magnitude >= 2.0:
        return 'gold';
        break;

      case magnitude >= 1.0:
        return 'yellow';
        break;

      default:
        return 'greenyellow';
    };
};


function Sizes(magnitude) {
  return magnitude*3;
}



