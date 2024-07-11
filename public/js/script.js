//Connection request goes from socket.io
const socket = io();

if(navigator.geolocation){

    //whenever this person moves, watch his position -> which takes a function 
    navigator.geolocation.watchPosition((position)=>{

        //extract co-ordinates of position
        const {latitude, longitude} = position.coords;

        //send co-ordinates to backend, accept it to the backend (app.js)
        socket.emit("send-location", {latitude, longitude})
    },
    (error)=>{      //if any error occurs
        console.error(error)
    },
    {   //setting 
        enableHighAccuracy: true, //high accuracy
        timeout: 5000, //after min sec does location wants back, where that guy is
        maximumAge: 0, //no-caching, take actual data rather than cached data
    }   
    );
}

const map = L.map("map").setView([0,0], 15) // gives location-([latitude, longitude], 10 level zoom)
//[0,0] intiliazing center of map

//openstreetmap will show you tiles of map, takes the dynamic values
L.tileLayer(`https://tile.openstreetmap.de/{z}/{x}/{y}.png`,{ 
    attribution: "StreetIndia"
}).addTo(map) //adding tile layer to the map, then global map will be displayed on the screen

const markers = {}

//received location data from backend
socket.on("receive-location", (data)=>{

    //extract 'data' from backend that is sent
    const { id, latitude, longitude} = data
    map.setView([latitude, longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude])
    }else{
        markers[id]=L.marker([latitude, longitude]).addTo(map)
    }
})

//received from backend is user is disconnected
socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})

