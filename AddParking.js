import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

const spaceForm = document.getElementById("parking-form");
spaceForm.addEventListener('submit', addParkingSpace);


async function addParkingSpace(e){

    e.preventDefault();
    const fileInput = document.getElementById("img-file");
    const parkingImage = fileInput.files[0];


    if(parkingImage){
        const extension = parkingImage.name.split('.').pop();
        const imgName = `${Math.random()}.${extension}`;
        const {data, error} = await supabase.storage
        .from('ParkingImages')
        .upload(`public/${imgName}`, parkingImage)

        if(error){
            console.log(error);
        }
        else{
            console.log("Image Uploaded!");
        }
    }
}