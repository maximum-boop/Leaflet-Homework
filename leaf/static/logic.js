const apiKey = 'pk.eyJ1Ijoia29maS1tYXgiLCJhIjoiY2t2eTV1cmNkMDgzdTJvbXY4MzEwNTk3YSJ9.eS3ZeXy7EZmq3mtlLCuvvg'
var map = L.map("map", {
    center: [7.9465, 1.0232],
    zoom: 3,
  });
const graymap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: apiKey
    }
  );

  var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
  //var earthquakes = data.features
  // Once we get a response, log the data.features to the console.
  //console.log(earthquakes)
  console.log("Here are how many data points are there:");
  console.log(data);

  function styleData(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor:color_depth(feature.geometry.coordinates[-1]),
      color: "#000000",
      radius: scaleRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  } 

  function color_depth(depth) {
    if (depth > 80)
    return '#450442';
    else if (depth >60)
    return '#41097a';
    else if (depth >40)
    return '#09497a';
    else if (depth>20)
    return '#097a45';
    else
    return '#737a09';
  
  }
  
  function scaleRadius(magnitude) { 
    if (magnitude === 0) {
        return 1;
  }
      return magnitude * 5;
  }

L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[-1]
          + "<br>Location: "
          + feature.properties.place
      );
    }
  }).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });
// Then add all the details for the legend
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-20, 20, 40, 60, 80];
    var colors = [
        '#450442',
        '#41097a',
        '#09497a',
        '#097a45',
        '#737a09'
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});