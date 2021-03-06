

////////////////////////////////////////////////////////////////////////////////
//                          INTERACTIVE MAP
////////////////////////////////////////////////////////////////////////////////

  $('.js-open-map').on('click', function(e) {
    e.preventDefault();
    // disable scrolling on background content (doesn't work iOS)
    $('body').addClass('map-disable-scroll');
    // dont reload the map if its already open
    var mapFocusValue = $(e.currentTarget).data('map-focus');
    if ($('#map').children().length === 0) { map(mapFocusValue); }
    $('.map__wrap').removeClass('is-closed').addClass('is-open');
  })

  function mapClose(e){
    e.preventDefault();
    // enable scrolling on background content
    $('body').removeClass('map-disable-scroll');
    $('.map__wrap').removeClass('is-open').addClass('is-closed');
  }

  $('.js-close-map').click(function(event){ mapClose(event); });

  // closes modal on escape key press
  $(document).keyup(function(event) {
    if (event.keyCode == 27) {
      mapClose(event);
    }
  });

  function map(mapFocus){

    // setting zoom levels for different map data
    var poiZoomLevel = 6;
    var overviewZoomLevel = 5.8;
    var maxZoomLevel       = 16;
    var minZoomLevel       = 4;
    var markerColor        = "#c11b28";

    // launch map with settings - append "?fresh=true" to "style:" to refresh
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/hamishjgray/cjqfg2s4y0h3t2sq3u9ziyxif',
      logoPosition: 'bottom-right',
      zoom: 5.8,
      minZoom: minZoomLevel,
      maxZoom: maxZoomLevel - 0.5,
      center: [117.431714, 22.895755]
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    // general function for focusing the view of the map on certain markers
    function focusMapOn(layerDataSource) {
      var bounds = new mapboxgl.LngLatBounds();
      layerDataSource.features.forEach(function(feature) {
        bounds.extend(feature.geometry.coordinates);
      });
      // set different padding depending on original viewport width
      // not super precise but should catch mobile phones and reduce the padding
      var iconPadding;
      if ($(window).innerWidth() < 400) {
        iconPadding = { "padding": 60 };
      } else {
        iconPadding = { "padding": 120 };
      }
      map.fitBounds(bounds, iconPadding); // adds padding so markers aren't on edge
    }



    // builds map with custom functionality
    map.on('load', function(event) {


      if (mapFocus == "hong-kong") {
        focusMapOn(hongKongMarkers);
      } else if (mapFocus == "taiwan") {
        focusMapOn(taiwanMarkers);
      } else if (mapFocus == "cities") {
        // focus zoomed out on both city markers
        // focusMapOn(cityMarkers);
      }


      //////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////  CITY MARKERS
      //////////////////////////////////////////////////////////////////////////

      // markers
      map.addLayer({
        id: 'cities',
        type: 'circle',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: cityMarkers
        },
        paint: { // style formatting for the cluster circle
          "circle-radius": 0
        }
      });

      // markers labels
      map.addLayer({
        id: 'city-labels',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: cityMarkers
        },
        layout: {
          "text-field": "{title}",
          "text-font": ["Rubik Regular"],
          "text-size": 22,
          "text-anchor": "center",
          "text-letter-spacing": 0.25,
          "text-transform": "uppercase",
          "text-offset": [1.1, 0.1]
        },
        paint: { "text-color": "#2e2e2e" }
      });

      // maker label zoom levels
      map.setLayerZoomRange('city-labels', overviewZoomLevel, maxZoomLevel);

      function cityClickEvent(e) {

        // find the coordinates for the clicked city
        var clickedCityCoordinates;
        for (var i = 0; i < cityMarkers.features.length; i++) {
          if (cityMarkers.features[i].properties.id === e.features[0].properties.id) {
            clickedCityCoordinates = cityMarkers.features[i].geometry.coordinates;
          }
        }

        // get the current zoom level
        var currentZoomLevel = map.getZoom();
        if (currentZoomLevel <= poiZoomLevel) {
          // function for when zoomed out on germany
          map.flyTo({
            center: clickedCityCoordinates,
            zoom: (poiZoomLevel + .5)
          });
        } else {
          var clickedModalId = e.features[0].properties.id;
          modalOpen(null, clickedModalId);
        }
      }

      // marker click event
      map.on('click', 'cities', function (e) {
        cityClickEvent(e);
      });

      // maker label click event
      map.on('click', 'city-labels', function (e) {
        cityClickEvent(e);
      });



      //////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////  HONG KONG MARKERS
      //////////////////////////////////////////////////////////////////////////

      // markers
      map.addLayer({
        id: 'hong-kong',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: hongKongMarker
        },
        layout: {
          "icon-image": "poi",
          "icon-size": 1,
          'icon-anchor': "bottom",
          "icon-allow-overlap": true
        }
      });

      // marker zoom levels
      map.setLayerZoomRange('hong-kong', minZoomLevel, poiZoomLevel);

      // marker label
      map.addLayer({
        id: 'hong-kong-label',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: hongKongMarker
        },
        layout: {
          "text-field": "{title}",
          "text-font": ["Rubik Regular"],
          "text-size": 22,
          "text-anchor": "center",
          "text-letter-spacing": 0.25,
          "text-transform": "uppercase",
          "text-offset": [0, 1]
        },
        paint: {
          "text-color": "#2e2e2e"
        }
      });

      // marker label zoom levels
      map.setLayerZoomRange('hong-kong-label', overviewZoomLevel, poiZoomLevel);

      // marker click event
      map.on('click', 'hong-kong', function (e) {
        focusMapOn(hongKongMarkers);
      });

      // marker label click event
      map.on('click', 'hong-kong-label', function (e) {
        focusMapOn(hongKongMarkers);
      });

      // data source
      map.addSource("hongkong-markers", {
        type: "geojson",
        data: hongKongMarkers,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 45
      });

      // background colour
      map.addLayer({
        id: "hongkong-clusters",
        type: "circle",
        source: "hongkong-markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": markerColor,
          "circle-radius": 23
        }
      });

      // cluster number shadow
      map.addLayer({
        id: "hongkong-cluster-count-shadow",
        type: "symbol",
        source: "hongkong-markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Rubik Medium"],
          "text-size": 24
        },
        paint: {
          "text-color": "#810612",
          "text-translate": [-1.75,2.25]
        }
      });

      // background colour zoom level
      map.setLayerZoomRange('hongkong-clusters', poiZoomLevel, maxZoomLevel);

      // background colour click event
      map.on('click', 'hongkong-clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['hongkong-clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('hongkong-markers').getClusterExpansionZoom(clusterId, function (error, zoom) {
          if (error) { return; }
          // center on expanded cluster
          map.flyTo({
            center: features[0].geometry.coordinates,
            zoom: (zoom + 1) // makes it zoom in a bit more so the group breaks up quicker?
          });
        });
      });

      // cluster number shadow zoom level
      map.setLayerZoomRange('hongkong-cluster-count-shadow', poiZoomLevel, maxZoomLevel);

      // cluster number
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "hongkong-markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Rubik Medium"],
          "text-size": 24
        },
        paint: {
          "text-color": "#fff",
          "text-translate": [-0.75,1.25]
        }
      });

      // cluster number zoom level
      map.setLayerZoomRange('cluster-count', poiZoomLevel, maxZoomLevel);

      // markers
      map.addLayer({
        id: "hongkong-pois",
        type: "symbol",
        source: "hongkong-markers",
        filter: ["!has", "point_count"],
        layout: {
          "icon-image": "poi", // custom icon is in the mapbox style spritesheet
          "icon-size": 0.5,
          'icon-anchor': "bottom",
          'icon-allow-overlap': true
        }
      });

      // marker zoom level
      map.setLayerZoomRange('hongkong-pois', poiZoomLevel, maxZoomLevel);

      // marker click event
      map.on('click', 'hongkong-pois', function (e) {
        var clickedPoiId = e.features[0].properties.id
        modalOpen(null, clickedPoiId);
      });




      //////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////  TAIWAN
      //////////////////////////////////////////////////////////////////////////

      // markers
      map.addLayer({
        id: 'taiwan',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: taiwanMarker
        },
        layout: {
          "icon-image": "poi",
          "icon-size": 1,
          'icon-anchor': "bottom",
          "icon-allow-overlap": true
        }
      });

      // marker zoom levels
      map.setLayerZoomRange('taiwan', minZoomLevel, poiZoomLevel);

      // marker label
      map.addLayer({
        id: 'taiwan-label',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: taiwanMarker
        },
        layout: {
          "text-field": "{title}",
          "text-font": ["Rubik Regular"],
          "text-size": 22,
          "text-anchor": "center",
          "text-letter-spacing": 0.25,
          "text-transform": "uppercase",
          "text-offset": [0, 1]
        },
        paint: {
          "text-color": "#2e2e2e"
        }
      });

      // marker label zoom levels
      map.setLayerZoomRange('taiwan-label', overviewZoomLevel, poiZoomLevel);

      // marker click event
      map.on('click', 'taiwan', function (e) {
        focusMapOn(taiwanMarkers);
      });

      // marker label click event
      map.on('click', 'taiwan-label', function (e) {
        focusMapOn(taiwanMarkers);
      });

      // data source
      map.addSource("taiwan-markers", {
        type: "geojson",
        data: taiwanMarkers,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 45
      });

      // background colour
      map.addLayer({
        id: "taiwan-clusters",
        type: "circle",
        source: "taiwan-markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": markerColor,
          "circle-radius": 23
        }
      });

      // cluster number shadow
      map.addLayer({
        id: "taiwan-cluster-count-shadow",
        type: "symbol",
        source: "taiwan-markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Rubik Medium"],
          "text-size": 24
        },
        paint: {
          "text-color": "#810612",
          "text-translate": [-1.75,2.25]
        }
      });

      // background colour zoom level
      map.setLayerZoomRange('taiwan-clusters', poiZoomLevel, maxZoomLevel);

      // background colour click event
      map.on('click', 'taiwan-clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['taiwan-clusters'] });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('taiwan-markers').getClusterExpansionZoom(clusterId, function (error, zoom) {
          if (error) { return; }
          // center on expanded cluster
          map.flyTo({
            center: features[0].geometry.coordinates,
            zoom: (zoom + 1) // makes it zoom in a bit more so the group breaks up quicker?
          });
        });
      });

      // cluster number shadow zoom level
      map.setLayerZoomRange('taiwan-cluster-count-shadow', poiZoomLevel, maxZoomLevel);

      // cluster number
      map.addLayer({
        id: "taiwan-cluster-count",
        type: "symbol",
        source: "taiwan-markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Rubik Medium"],
          "text-size": 24
        },
        paint: {
          "text-color": "#fff",
          "text-translate": [-0.75,1.25]
        }
      });

      // cluster number zoom level
      map.setLayerZoomRange('taiwan-cluster-count', poiZoomLevel, maxZoomLevel);

      // markers
      map.addLayer({
        id: "taiwan-pois",
        type: "symbol",
        source: "taiwan-markers",
        filter: ["!has", "point_count"],
        layout: {
          "icon-image": "poi", // custom icon is in the mapbox style spritesheet
          "icon-size": 0.5,
          'icon-anchor': "bottom",
          'icon-allow-overlap': true
        }
      });

      // marker zoom level
      map.setLayerZoomRange('taiwan-pois', poiZoomLevel, maxZoomLevel);

      // marker click event
      map.on('click', 'taiwan-pois', function (e) {
        var clickedPoiId = e.features[0].properties.id
        modalOpen(null, clickedPoiId);
      });

    });
  }