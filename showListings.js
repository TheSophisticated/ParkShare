import { createClient } from 'https://esm.sh/@supabase/supabase-js'
const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

const {data: {session}, error} = await supabase.auth.getSession();

if(session){
    const {data, error} = await supabase.from('parking_spaces').select().eq('user_id', session.user.id);
    const listDiv = document.getElementById("listings");
    listDiv.innerHTML = '';

    data.forEach((item, index) => {
        const card = `
           <a href = "booking.html?id=${item.parking_id}" style="text-decoration: none">
                <div class="card" style="animation-delay:${index*0.15}s">

                    <div class="card-header">

                        <img class="avatar" src = "images/profile.png">

                        <div>
                            <div class="vehicle">${item.vehicle_type}</div>
                            <div class="renter">${item.renter_name}</div>
                        </div>

                    </div>

                    <img class="space" src="${item.image}" alt="Parking Space">

                    <div class="location">
                        📍 Parking space available
                    </div>

                    <div class="price">
                        ₹${item.rate} <span style="font-size:0.8rem;color:#777;">/hour</span>
                    </div>

                </div>
            </a>
        `;

        listDiv.innerHTML += card;
    });

} else{
    const card = document.getElementById('main');
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