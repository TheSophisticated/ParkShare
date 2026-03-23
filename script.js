document.addEventListener("DOMContentLoaded", async () => {
    const supabaseUrl = "https://wbtzkgpkcigqaecdjlbn.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHprZ3BrY2lncWFlY2RqbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NDk2MTgsImV4cCI6MjA4MjIyNTYxOH0.4ZZO81-Uwdvjjvd_GR-aNyqrgT15XOJhSMAzp8LsPv8";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const params = new URLSearchParams(window.location.search);
    const spaceId = params.get('id');
    let currentRate = 0; // CHANGE 1: Variable to store the rate globally

    if(!spaceId){
        console.error("No Parking ID Found!");
        return;
    }

    const {data: spot, error: fetchError} = await supabase
    .from('parking_spaces')
    .select('*')
    .eq('parking_id', spaceId)
    .single();

    if(fetchError){
        console.error("Error Fetching Spot: ", fetchError);
    }
    else if(spot){
        document.querySelector('.info-content h1').textContent = `${spot.renter_name}'s Spot`;
        document.querySelector('.price strong').textContent = `₹${spot.rate}`;
        document.querySelector('.image-placeholder img').src = spot.image;
        document.querySelector('.tagline').textContent = `Vehcile Type: ${spot.vehicle_type}`;
        
        currentRate = spot.rate; // CHANGE 2: Save the rate from the database
    }

    const slots = document.querySelectorAll(".slot");
    let selectedTime = "";

    slots.forEach(slot => {
        slot.addEventListener("click", () => {
            slots.forEach(s => s.classList.remove("active"));
            slot.classList.add("active");
            selectedTime = slot.innerText;
        });
    });


    const messageEl = document.createElement("div");
    messageEl.classList.add("success-message");
    messageEl.style.position = "fixed";
    messageEl.style.top = "-50px"; 
    messageEl.style.left = "50%";
    messageEl.style.transform = "translateX(-50%)";
    messageEl.style.padding = "10px 20px";
    messageEl.style.backgroundColor = "#4BB543";
    messageEl.style.color = "#fff";
    messageEl.style.borderRadius = "5px";
    messageEl.style.opacity = 0;
    messageEl.style.transition = "all 0.5s ease"; 
    document.body.appendChild(messageEl);

    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const {data: {session}, userError} = await supabase.auth.getSession();
        if (userError || !session) {
            alert("You must be logged in to make a booking!");
            window.location.href = "login.html";
            return;
        }

        const date = document.querySelector('input[type="date"]').value;
        const firstName = document.querySelector('input[placeholder="First Name"]').value;
        const lastName = document.querySelector('input[placeholder="Last Name"]').value;
        const email = document.querySelector('input[type="email"]').value;

        if (!date || !firstName || !lastName || !email || !selectedTime) 
        {
            alert("Please fill in all fields and select a time slot.");
            return;
        }

        const { data, error } = await supabase
            .from("bookings")
            .insert([
                {   
                    parking_id: spaceId,
                    user_id: session.user.id,
                    date: date,
                    time_slot: selectedTime,
                    first_name: firstName,
                    last_name: lastName,
                    email: email
                }
            ]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            // CHANGE 3: Store the rate in localStorage for the Payment page
            localStorage.setItem('bookingAmount', currentRate);

            form.style.transition = "opacity 0.5s ease";
            form.style.opacity = 0;

            setTimeout(() => {
                form.reset();
                selectedTime = "";
                slots.forEach(s => s.classList.remove("active"));

                form.style.opacity = 1;

                messageEl.innerText = "Booking successful! Redirecting to payment...";
                messageEl.style.top = "20px"; 
                messageEl.style.opacity = 1;

                setTimeout(() => {
                    // CHANGE 4: Redirect to the payment page automatically
                    window.location.href = "Payment/Payment.html"; 
                }, 1500);
            }, 500);
        }
    });
});
