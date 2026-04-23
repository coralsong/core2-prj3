// creates map
const map = L.map('map').setView([40.7359, -73.9911], 15);

const bounds = L.latLngBounds(
    [40.7003, -74.0200],
    [40.8820, -73.9070]
);

map.setMaxBounds(bounds);
map.options.maxBoundsViscosity = 1.0;

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 13.5,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// submission form
const submissionForm = document.getElementById('submissionForm');
const storeNameInput = document.getElementById('storeName');
const eggPriceInput = document.getElementById('eggPrice');    
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');

let clickedLatLng = null;

// opens form when map is clicked
map.on('click', (e) => {
    clickedLatLng = e.latlng;
    submissionForm.classList.add('active');
});

// places pin when form is submitted
submitButton.addEventListener('click', () => {
    const storeName = storeNameInput.value.trim(); 
    const eggPrice = eggPriceInput.value.trim();   

    if (!storeName || !eggPrice) {
        alert('Please fill in both the store name and price.');
        return;
    }

    const marker = L.marker(clickedLatLng).addTo(map);
    marker.bindPopup(`
        <b>${storeName}</b><br>
        Eggs: $${parseFloat(eggPrice).toFixed(2)} per dozen
    `).openPopup();

    storeNameInput.value = ''; 
    eggPriceInput.value = ''; 
    submissionForm.classList.remove('active');
    clickedLatLng = null;
});

// closes form on cancel
cancelButton.addEventListener('click', () => {
    storeNameInput.value = '';
    eggPriceInput.value = '';
    submissionForm.classList.remove('active');
    clickedLatLng = null;
});