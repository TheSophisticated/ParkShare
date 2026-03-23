const supabaseUrl = 'https://wbtzkgpkcigqaecdjlbn.supabase.co';
const supabaseKey = 'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const payBtn = document.getElementById('payBtn');
const amountInput = document.getElementById('amountInput');

payBtn.addEventListener('click', async () => {
    const amount = amountInput.value;

    const methodElement = document.querySelector('input[name="method"]:checked');
    const method = methodElement ? methodElement.id : null;

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if (!method) {
        alert("Please select a payment method");
        return;
    }

    payBtn.innerText = "Processing...";
    payBtn.disabled = true;

    try {
        // 1. Generate a random Booking ID
        const generatedBookingId = crypto.randomUUID();

        // 2. Get the current session
        const { data: { session }, error: sessionError } = await _supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // 3. Insert data into the table
        const { data, error } = await _supabase
            .from('Payment')
            .insert([
                {
                    amount: parseFloat(amount),
                    payment_method: method,
                    status: 'paid', 
                    booking_id: generatedBookingId, // New random ID added here
                    user_id: session ? session.user.id : null, 
                    create_at: new Date().toISOString() 
                }
            ]);

        if (error) throw error;

        // Success Alert with the ID included
        alert(`Payment of ₹${amount} recorded successfully!\nBooking ID: ${generatedBookingId}`);
        amountInput.value = "";

    } catch (err) {
        console.error("Error:", err.message);
        alert("Payment failed: " + err.message);
    } finally {
        payBtn.innerText = "Pay Securely";
        payBtn.disabled = false;
    }
});