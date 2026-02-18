import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

//NOTE: LOCATION FEATURE IN PROGRESS

const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

let marker = null;

const spaceForm = document.getElementById("parking-form");
spaceForm.addEventListener('submit', addParkingSpace);

const locationBtn = document.getElementById('find-location');
locationBtn.addEventListener('click', fetchLocation());

async function fetchLocation(e){
    const addr1 = document.getElementById('street').value;
    const addr2 = document.getElementById('appt').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;

    const parts = [addr1, addr2, city, pincode, "India"];
    const address = parts.join(', ');

    const geoSearchUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=699621d3b4b73122333572wtmd74261`;
    console.log(geoSearchUrl);

    const geoFetch = await fetch(geoSearchUrl);
    const location = await geoFetch.json();

    if(location.length > 0){
        const {lat, lon} = location[0];
        console.log(lat, lon);
        map.invalidateSize();

        map.setView([lat, lon], 16); // 16 is a good street-level zoom

        // 2. If a marker already exists, remove it
        if (marker) map.removeLayer(marker);

        // 3. Add a new marker at the spot
        marker = L.marker([lat, lon], { draggable: true }).addTo(map);

        // 4. Update coordinates if the user drags the pin!
        marker.on('dragend', function(event) {
            const position = marker.getLatLng();
            console.log("User refined location to:", position.lat, position.lng);
            // You can save these new coordinates to your hidden form inputs
        });

    }

    
}


async function addParkingSpace(e){

    e.preventDefault();

    const renterName = document.getElementById('renter-name').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    const rate = document.getElementById('rate').value;


    //Get Uploaded Image
    const fileInput = document.getElementById("img-file");
    const parkingImage = fileInput.files[0];

    
    if(parkingImage){
        const extension = parkingImage.name.split('.').pop();
        const imgName = `${Math.random()}.${extension}`;

        const {data, error: uploadError} = await supabase.storage
        .from('ParkingImages')
        .upload(`public/${imgName}`, parkingImage)

        //Fetch the URL of the image in Storage Bucket to reference in Table
        const {data: {publicUrl}} = supabase.storage
        .from('ParkingImages')
        .getPublicUrl(`public/${imgName}`);

        const { error } = await supabase
        .from('parking_spaces')
        .insert({renter_name: renterName, vehicle_type: vehicleType, rate: rate, image: publicUrl});


        if(error){
            console.log(error);
        }
        else{
            console.log("Image Uploaded!");
        }
    }

    

}