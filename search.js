const searchBar = document.getElementById('search-bar');
const searchScreen = document.getElementById('search-overlay');
const searchRegion = document.getElementById('search-region');

const mainSearch = document.getElementById('auto-search-input');

searchBar.addEventListener('click', function(){
    searchScreen.classList.remove('hidden');
    searchRegion.classList.add('activate');
})

var timer;
const typeInterval = 500;

mainSearch.addEventListener('input', function(){
    clearTimeout(timer);

    if(mainSearch.value.length > 2){
        timer = setTimeout(getAutocomplete, typeInterval);
    }
});

searchScreen.addEventListener('click', function(event){
    if(event.target === searchScreen){
        searchScreen.classList.add('hidden');
    }
})

async function getAutocomplete(){
    const query = mainSearch.value;
    const geoSearchUrl = `https://us1.locationiq.com/v1/search?key=pk.f1d495d5ddccc8734a3dcf45b1b5db4b&q=${query}&format=json&`;

    try{
        const response = await fetch(geoSearchUrl);
        const data = await response.json();
        showResults(data);
    }
    catch(error){
        console.log(error);
    }
}

async function showResults(data){
    const resultRegion = document.getElementById('results-list');
    resultRegion.innerHTML = '';

    data.forEach(place =>{
        const container = document.createElement('div');
        container.className = 'autocomplete-item';
        container.textContent = place.display_name;

        container.addEventListener('click', function(e){
            e.preventDefault();

            mainSearch.value = place.display_name;
            const lat = place.lat;
            const lon = place.lon
            const address = encodeURIComponent(place.display_name);

            window.location.href = `results.html?lat=${lat}&lon=${lon}&addr=${address}`;  
        });

        resultRegion.appendChild(container);

    });
}