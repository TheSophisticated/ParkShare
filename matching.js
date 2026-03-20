import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

async function init() {
    console.log("Matching system initialized...");
    
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lon = params.get('lon');
    const addr = params.get('addr');

    if (!lat || !lon) {
        console.error("No coordinates found in URL parameters.");
        document.getElementById('results-list').innerHTML = `<div class="loading-state">Error: No location data found. Please search again.</div>`;
        return;
    }

    const nameSpan = document.getElementById('location-name');
    if (nameSpan) nameSpan.textContent = decodeURIComponent(addr || 'Search Area');

    try {
        const { data, error } = await supabase.rpc('match_nearby_parking', {
            target_lat: parseFloat(lat),
            target_lon: parseFloat(lon),
            radius_meters: 5000.0 
        });

        if (error) throw error;

        if (!data || data.length === 0) {
            document.getElementById('results-list').innerHTML = `<div class="loading-state">No spots found within 5km. Try searching a different area!</div>`;
            return;
        }

        const maxPrice = Math.max(...data.map(s => s.rate));
        
        const rankedData = data.map(item => {
            const priceScore = 1 - (item.rate / (maxPrice + 1));
            const distScore = 1 - (item.distance_meters / 5000);
            const totalScore = Math.round(((priceScore * 0.6) + (distScore * 0.4)) * 100);
            return { ...item, matchScore: totalScore };
        });

        rankedData.sort((a, b) => b.matchScore - a.matchScore);

        // 5. Render to the page
        renderResults(rankedData);

    } catch (err) {
        console.error("Database or Search Error:", err);
        document.getElementById('results-list').innerHTML = `<div class="loading-state" style="color:red;">Failed to fetch results: ${err.message}</div>`;
    }
}

function renderResults(spaces) {
    const list = document.getElementById('results-list');
    list.innerHTML = spaces.map((space, index) => `
        <a href = "booking.html?id=${space.parking_id}" style="text-decoration: none">
            <div class="rank-card">
                <div class="rank-number">#${index + 1}</div>
                <img src="${space.image}" class="space-img" onerror="this.src='https://via.placeholder.com/240x160?text=No+Image'">
                
                <div class="info-section">
                    <div class="match-badge">${space.matchScore}% Greedy Match</div>
                    <div class="renter-name">${space.renter_name}'s Spot</div>
                    <div class="distance-tag">📍 ${(space.distance_meters / 1000).toFixed(1)} km away</div>
                    <p style="margin-top:10px; font-size:0.9rem; color:#4a5568;">Vehicle: <strong>${space.vehicle_type}</strong></p>
                </div>

                <div class="action-section">
                    <div class="price-val">₹${space.rate}</div>
                    <div class="price-unit">per hour</div>
                    <button class="book-btn" onclick="handleBooking('${space.parking_id}')">Book Now</button>
                </div>
            </div>
        </a>
    `).join('');
}

window.handleBooking = (id) => {
    alert("Teleporting to booking for spot ID: " + id);
};

init();