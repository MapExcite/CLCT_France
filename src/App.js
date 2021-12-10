import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

// import the mapbox styles
// alternatively can use a link tag in the head of public/index.html
// see https://docs.mapbox.com/mapbox-gl-js/api/
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

// Access token from Mapbox account
// Stored in an .env file

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
//mapboxgl.accessToken = "pk.eyJ1IjoidGltbGVpbmJhY2giLCJhIjoiY2tjODFwN3lzMG4wMTJ1azFtYXRnem1jbyJ9.yOcjnW3_nkefwHEqQArfuw"

function App() {
  const mapContainer = useRef();

  // map logic here
  // adding the empty dependency array ensures that the map
  // is only rendered once
  useEffect(() => {
    // create the map and configure it
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      //style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/timleinbach/ckwyxmxgq0qh514msxqoipnwe",
      center: [1.807024, 48.0046],
      zoom: 5.77
    });

    /* Scale Bar */
    map.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "imperial"
      }),
      "bottom-right"
    );

    /* Navigation Controls including Pitch */
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true
    });
    map.addControl(nav, "top-right");

    /* Set cursor style when hover on clickable feature and when move off */
    map.on("mousemove", "Clickable", (event) => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "Clickable", (event) => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mousemove", "Day_Start_End", (event) => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "Day_Start_End", (event) => {
      map.getCanvas().style.cursor = "";
    });

    /* 
Add an event listener that runs when a user clicks on the map element.
*/
    map.on("click", (event) => {
      // If the user clicked on one of your markers, get its information.

      /* This one is the original and no longer needed because replaced
     by features1 and features2, below */
      /*const features = map.queryRenderedFeatures(event.point, {
    layers: ['Clickable', 'ClickableRR', 'Day_Start_End'] // replace with your layer name
  });
  */

      /**********/
      /* Create two different const features so that popup contains different
  info depending on which one clicked, and layered selection (top to bottom).
  Features1 is for day start and end, and will not have a 
  photo nor long description.  Features2 is for routes, including the railway,
  which is layered on the bottom and have photos and description. */
      const features1 = map.queryRenderedFeatures(event.point, {
        layers: ["Day_Start_End"] // replace with your layer name
      });
      const features2 = map.queryRenderedFeatures(event.point, {
        layers: ["Clickable"] // replace with your layer name
      });

      /* 
    Create the popups, specify options and properties, and add to the map.
  */

      if (features1.length > 0) {
        const feature = features1[0];

        const popup = new mapboxgl.Popup({ offset: [0, 0] })
          .setLngLat(event.lngLat)
          .setHTML(
            `<h3>${feature.properties.Name}</h3>
    <p>${feature.properties.Distance}</p>
    <h4>${feature.properties.descript}</h4>`
          )
          /* this is sample of an jpeg image online; put images on my website or Andy's website */
          /*<p><img src="https://history.denverlibrary.org/sites/history/files/cdm_12.jpg"></p>*/
          .addTo(map);
      } else if (features2.length > 0) {
        const feature = features2[0];

        const popup = new mapboxgl.Popup({ offset: [0, 0] })
          .setLngLat(event.lngLat)
          .setHTML(
            `<h3>${feature.properties.Name}</h3>
    <p>${feature.properties.Distance}</p>
    <h4>${feature.properties.description}</h4>
    <p>${feature.properties.Full}</p>
     <p><img src=${feature.properties.Image} alt=${feature.properties.AltText}  width=100% 
     height=auto</p>`
          )

          .addTo(map);
      }
    });

    // Tim's says:  in case want to add additional layers, that
    //   may be in Mapbox, or ArcGIS, or maybe a GeoJSON???
    // SHOULD THIS BE PLACED UP HIGHER (EVEN THOUGH NOT REALLY USED)?
    // only want to work with the map after it has fully loaded
    // if you try to add sources and layers before the map has loaded
    // things will not work properly
    map.on("load", () => {});

    // cleanup function to remove map on unmount
    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}

export default App;
