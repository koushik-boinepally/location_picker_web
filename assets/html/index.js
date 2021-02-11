// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, marker;
let geocoder; 

async function initMap() {

    let currentCoords;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            currentCoords = position.coords;
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
    
              map.setCenter(pos);
              select(pos);
        })
    }

    if(currentCoords != null){
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: currentCoords.latitude, lng: currentCoords.longitude },
            zoom: 6,
          });
    }else{
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 12.9795883, lng: 77.6176381 },
            zoom: 17,
          });
    }

    geocoder = new google.maps.Geocoder();

    const locationButton = document.createElement("button");
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Your location");



            infoWindow.open(map);
            map.setCenter(pos);
        },
        () => {
            handleLocationError(true, infoWindow, map.getCenter());
        }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    });

    map.addListener('click', (e) => {
    console.log('Clicked');
    select(e.latLng)
    })

}

function select(latLng){
    if(marker == null){
        marker = new google.maps.Marker({
            position: latLng,
            map,
            title: "Selected Location",
          });
    }else{
        marker.setPosition(latLng);
    }

    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
              console.log(results[0].formatted_address);

              const result = {
                formattedAddress : result[0].formatted_address,
                latitude: latLng.lat,
                longitude: latLng.lng
              };

              window.parent.postMessage(JSON.stringify(result),"*");

          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
