const params = new URLSearchParams(window.location.search);
const parkingId = params.get('parking');

if (!parkingId) {
    alert("Missing parking ID in URL");
    throw new Error("No parking ID");
}

const { createClient } = supabase;

const supabaseClient = createClient(
    "https://wbtzkgpkcigqaecdjlbn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHprZ3BrY2lncWFlY2RqbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NDk2MTgsImV4cCI6MjA4MjIyNTYxOH0.4ZZO81-Uwdvjjvd_GR-aNyqrgT15XOJhSMAzp8LsPv8"
);

let userId = localStorage.getItem('user_id');

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('user_id', userId);
}

console.log("User ID:", userId);

// --- VARIABLES ---
let currentRating = 0;
const stars = document.querySelectorAll('.star');
const output = document.getElementById('rating-output');
const reviewsList = document.getElementById('reviews-list');
const new_comments = document.getElementById('input-comments');
const commentform = document.getElementById('Comments');
const commentadd = document.getElementById('comment-btn');
const commentlist = document.getElementById('comments-added');
const avgRatingDisplay = document.getElementById('avg-rating');

// --- INITIALIZATION ---
// Load existing reviews from Local Storage when page loads
document.addEventListener('DOMContentLoaded', function() {

    const parkingTitle = document.getElementById('parking-title');

    if (parkingTitle) {
        parkingTitle.innerText = `Reviews for ${parkingId}`;
    }

    loadReviews();
    testSupabaseConnection();
});

// --- STAR CLICK LOGIC ---
stars.forEach(star => {
    star.addEventListener('click', function() {
        currentRating = this.getAttribute('data-value');
        output.innerText = currentRating;
        updateStarVisuals(currentRating);
    });
});

// --- VISUAL UPDATE FUNCTION ---
function updateStarVisuals(rating) {
    stars.forEach(star => {
        const starValue = star.getAttribute('data-value');
        if (starValue <= rating) {
            star.innerHTML = '&#9733;'; 
        } 
        else {
            star.innerHTML = '&#9734;'; 
        }
    });
}

// --- SUBMIT / STORE LOGIC ---
document.getElementById('submit-btn').addEventListener('click', async function() {

    if (currentRating === 0) {
        alert("Please select a star rating first.");
        return;
    }

    if (new_comments.value.trim() === "") {
        alert("Please leave a review first.");
        return;
    }

    const { data: existingReview, error: checkError } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('parking_id', parkingId)
        .single();

    if (existingReview) {
        alert("You have already submitted a review for this parking!");
        return;
    }

    const { data, error } = await supabaseClient
        .from('reviews')
        .insert([
        {
            review_content: new_comments.value.trim(),
            review_val: currentRating,
            parking_id: parkingId,
            user_id: userId
        }
        ])
        .select();

    if (error) {
        console.error("Insert failed:", error);
        return;
    }

    console.log("Review inserted:", data);

    await loadReviews();

    currentRating = 0;
    output.innerText = "0";
    updateStarVisuals(0);
    new_comments.value = "";
});

// --- DISPLAY LOGIC ---
async function loadReviews() {

    const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('parking_id', parkingId)
        .order('id', { ascending: false })

    if (error) {
        console.error("Error loading reviews:", error);
        return;
    }

    renderReviews(data);
    calculateAverage(data);
}

// --- OUTPUT LOGIC ---
function renderReviews(reviews) {
    reviewsList.innerHTML = ''; 

    reviews.forEach(review => {
        const li = document.createElement('li');

        li.innerText = `Comment: ${review.review_content}
        Rating: ${review.review_val} Stars
        (${new Date(review.created_at).toLocaleString()})`;

        if (review.user_id === userId) {
            li.style.border = "2px solid #fbbf24"; 
            li.style.backgroundColor = "#fff8dc"; 
            li.style.fontWeight = "bold";
        }

        reviewsList.appendChild(li);
    });
}

function calculateAverage(reviews) {

    if (reviews.length === 0) {
        avgRatingDisplay.innerText = "0";
        return;
    }

    let total = 0;

    reviews.forEach(review => {
        total += review.review_val;
    });

    const avg = (total / reviews.length).toFixed(1);

    avgRatingDisplay.innerText = avg;
}

// --- SUPABASE CONNECTION TEST ---
async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from('reviews')
        .select('*');

    if (error) {
        console.error("Supabase connection failed:", error);
    } 
    else {
        console.log("Supabase connected successfully!");
        console.log(data);
    }
}