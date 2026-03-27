import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

const {data: {session} , error} = await supabase.auth.getSession();

if(session){
    const card = document.getElementById('main-form');
} else{
    const card = document.getElementById('main-form');
    card.innerHTML = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-top: 50px;">
            <h2 style="color: purple;">Members Only Area</h2>
            <p style="color: #666; margin-bottom: 30px;">You need to be logged in to list your parking space on ParkShare.</p>
            <a href="login.html" style="background: purple; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                Login / Sign Up Now
            </a>
        </div>
    `;
}

const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

let marker = null;

const spaceForm = document.getElementById("parking-form");
spaceForm.addEventListener('submit', addParkingSpace);

const locationBtn = document.getElementById('find-location');
locationBtn.addEventListener('click', fetchLocation);

async function fetchLocation(e){
    const addr1 = document.getElementById('street').value;
    const addr2 = document.getElementById('appt').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;
    
    const parts = [addr1, addr2, city, pincode, "India"];
    const address = parts.join(', ');

    const geoSearchUrl = `https://us1.locationiq.com/v1/search?key=pk.f1d495d5ddccc8734a3dcf45b1b5db4b&q=${address}&format=json&`;
    console.log(geoSearchUrl);

    const geoFetch = await fetch(geoSearchUrl);
    const location = await geoFetch.json();

    if(location.length > 0){
        const {lat, lon} = location[0];
        console.log(lat, lon);
        map.invalidateSize();

        map.setView([lat, lon], 16);

        if (marker) map.removeLayer(marker);

        marker = L.marker([lat, lon], { draggable: true }).addTo(map);

        document.getElementById('lat-input').value = lat;
        document.getElementById('lon-input').value = lon;

        marker.on('dragend', function(event) {
            const position = marker.getLatLng();
            console.log("User refined location to:", position.lat, position.lng);
            document.getElementById('lat-input').value = position.lat;
            document.getElementById('lon-input').value = position.lng;
        });

    }
}


async function addParkingSpace(e){

    e.preventDefault();

    const renterName = document.getElementById('renter-name').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    const rate = document.getElementById('rate').value;

    const lat = document.getElementById('lat-input').value;
    const lon = document.getElementById('lon-input').value;
    const pointLoc = `POINT(${lon} ${lat})`;


    const fileInput = document.getElementById("img-file");
    const parkingImage = fileInput.files[0];

    
    if(parkingImage){
        const extension = parkingImage.name.split('.').pop();
        const imgName = `${Math.random()}.${extension}`;

        const {data, error: uploadError} = await supabase.storage
        .from('ParkingImages')
        .upload(`public/${imgName}`, parkingImage)

        const {data: {publicUrl}} = supabase.storage
        .from('ParkingImages')
        .getPublicUrl(`public/${imgName}`);

        const { error } = await supabase
        .from('parking_spaces')
        .insert({renter_name: renterName, 
            vehicle_type: vehicleType, 
            rate: rate, 
            image: publicUrl,
            location: pointLoc,
            user_id: session.user.id
        });


        if(error){
            console.log(error);
        }
        else{
            alert("Space Listed Successfull!");
            console.log("Image Uploaded!");
        }
    }
}