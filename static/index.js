console.log("test");

// fetch("/data/SPORT_OPENBAAR.json")
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(json) {
//     console.log(json);
//     var test = renderMap(json);
//   })
//   .catch(function(err) {
//     console.log("Fetch problem: " + err.message);
//   });

function renderMap() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic3RlcnJldmFuZ2Vlc3QiLCJhIjoiY2p3OTI2OXh4MGY4ZzQxcGR3NThlYXIzbSJ9._7gKhZh49a7Hv5xBTfHBGA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/sterrevangeest/cjw98k3yq0a751cl6q76qpu9k",
    center: [4.964503, 52.311111],

    zoom: 12
  });
  map.on("load", function() {
    // Add a new source from our GeoJSON data and set the
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource("sportvelden", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: "../data/SPORT_OPENBAAR.geojson",
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "sportvelden",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          5,
          "#51bbd6",
          10,
          "#51bbd6"
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
      }
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "sportvelden",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "sportvelden",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#fff",
        "circle-radius": 20
      }
    });

    // inspect a cluster on click
    map.on("click", "clusters", function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });
      var clusterId = features[0].properties.cluster_id;
      map
        .getSource("sportvelden")
        .getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
    });

    map.on("mouseenter", "clusters", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", function() {
      map.getCanvas().style.cursor = "";
    });
  });
}

renderMap();
