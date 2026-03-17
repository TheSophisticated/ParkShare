// --- VARIABLES ---
let currentRating = 0;
const stars = document.querySelectorAll('.star');
const output = document.getElementById('rating-output');
const reviewsList = document.getElementById('reviews-list');
const new_comments = document.getElementById('input-comments');
const commentform = document.getElementById('Comments');
const commentadd = document.getElementById('comment-btn');
const commentlist = document.getElementById('comments-added');
let TotalReviews = 0;
let ReviewSum = 0;
let AvgReview = 0.00;

// --- INITIALIZATION ---
// Load existing reviews from Local Storage when page loads
document.addEventListener('DOMContentLoaded', loadReviews);

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

// --- AVG OF ALL REVIEWS ---
document.getElementById('submit-btn').addEventListener('click', function() {
    TotalReviews++;
    ReviewSum += Number(currentRating);

    AvgReview = ReviewSum/TotalReviews;
});

// --- SUBMIT / STORE LOGIC ---
document.getElementById('submit-btn').addEventListener('click', function() {
    if (currentRating === 0) {
        alert("Please select a star rating first.");
        return;
    }
    else if (new_comments.value.trim() === "") {
        alert("Please leave a review first.");
        return;
    }

    const review = {
        text: new_comments.value.trim(),
        rating: currentRating,
        date: new Date().toLocaleString()
    };
    
    let storedReviews = JSON.parse(localStorage.getItem('my_reviews')) || [];
    storedReviews.push(review);
    localStorage.setItem('my_reviews', JSON.stringify(storedReviews));

    renderReviews(storedReviews);
    
    currentRating = 0;
    output.innerText = "0";
    updateStarVisuals(0);
    new_comments.value = "";
});

// --- CLEAR STORAGE LOGIC ---
document.getElementById('clear-btn').addEventListener('click', function() {
    TotalReviews = 0;
    ReviewSum = 0;
    AvgReview = 0.00;
    localStorage.removeItem('my_reviews');
    renderReviews([]); 
});

// --- DISPLAY LOGIC ---
function loadReviews() {
    const storedReviews = JSON.parse(localStorage.getItem('my_reviews')) || [];
    renderReviews(storedReviews);
}

// --- OUTPUT LOGIC ---
function renderReviews(reviews) {
    reviewsList.innerHTML = ''; 
    reviews.forEach(review => {
        const li = document.createElement('li');
        li.innerText = `Comment: ${review.text} 
                        Rating: ${review.rating} Stars
                        (${review.date})
                        ${AvgReview}`;
        reviewsList.appendChild(li);
    });
}