const supabaseUrl = 'https://wbtzkgpkcigqaecdjlbn.supabase.co';
const supabaseKey = 'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'; 
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const payBtn = document.getElementById('payBtn');
const amountInput = document.getElementById('amountInput');

// --- STEP 1: AUTO-FILL THE AMOUNT ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // Get the amount we saved in the booking script
    const savedAmount = localStorage.getItem('bookingAmount');
    
    if (savedAmount && amountInput) {
        amountInput.value = savedAmount;
        amountInput.readOnly = true; // Locks the field so users can't change the price
    }
});

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
        const generatedBookingId = crypto.randomUUID();

        const { data: { session }, error: sessionError } = await _supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const { data, error } = await _supabase
            .from('Payment')
            .insert([
                {
                    amount: parseFloat(amount),
                    payment_method: method,
                    status: 'paid', 
                    booking_id: generatedBookingId, 
                    user_id: session ? session.user.id : null, 
                    create_at: new Date().toISOString() 
                }
            ]);

        if (error) throw error;

        alert(`Payment of ₹${amount} recorded successfully!\nBooking ID: ${generatedBookingId}`);
        
        // --- STEP 2: CLEANUP ---
        localStorage.removeItem('bookingAmount'); // Clear it so it doesn't stay for next time
        amountInput.value = "";

    } catch (err) {
        console.error("Error:", err.message);
        alert("Payment failed: " + err.message);
    } finally {
        payBtn.innerText = "Pay Securely";
        payBtn.disabled = false;
    }
});
