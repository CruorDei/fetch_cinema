// app.js
import CinemaFinder from './cinemaFinder.js';
import { getUserPosition, getAddressFromCoordinates, getCoordinatesFromAddress } from './geolocation.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cinemaFinder = new CinemaFinder();
    const cinemaListContainer = document.getElementById('cinemaList');
    const sortModeSelect = document.getElementById('sortMode');
    const sortModeDisplay = document.getElementById('sortModeDisplay');

    try {
        const userPosition = await getUserPosition();
        await refreshCinemaList(userPosition);

        sortModeSelect.addEventListener('change', async () => {
            await refreshCinemaList(userPosition);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la position :', error);
    }

    async function refreshCinemaList(userPosition) {
        try {
            const sortMode = sortModeSelect.value;
            const cinemas = await cinemaFinder.getCinemasNearUser(10, sortMode, userPosition);
            displaySortMode(sortModeDisplay, sortMode);
            displayCinemaTable(cinemaListContainer, cinemas, userPosition);
        } catch (error) {
            console.error('Erreur lors de la récupération des cinémas :', error);
        }
    }

    function displaySortMode(container, sortMode) {
        container.textContent = `Mode de tri actuel : ${sortMode === 'fauteuils' ? 'Par nombre de fauteuils' : 'Par distance'}`;
    }

    function displayCinemaTable(container, cinemas, userPosition) {
        container.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('cinemaTable');

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Nom</th>
            <th>Adresse</th>
            <th>Commune</th>
            <th>Fauteuils</th>
            <th>Séances</th>
            <th>Entrees 2022</th>
            <th>Genre</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Distance (km)</th>
        `;
        table.appendChild(headerRow);

        cinemas.forEach(cinema => {
            const cinemaRow = document.createElement('tr');
            cinemaRow.innerHTML = `
                <td>${cinema.nom}</td>
                <td>${cinema.adresse}</td>
                <td>${cinema.commune}</td>
                <td>${cinema.fauteuils}</td>
                <td>${cinema.seances}</td>
                <td>${cinema.entrees_2022}</td>
                <td>${cinema.genre}</td>
                <td>${cinema.geolocalisation.lat}</td>
                <td>${cinema.geolocalisation.lon}</td>
                <td>${cinema.distance.toFixed(2)}</td>
            `;
            table.appendChild(cinemaRow);
        });

        container.appendChild(table);
    }

    /*etape 3*/

    document.getElementById('geolocateButton').addEventListener('click', async () => {
        try {
            const userPosition = await getUserPosition();
            const address = await getAddressFromCoordinates(userPosition.lat, userPosition.lon);
            document.getElementById('addressInput').value = address;
        } catch (error) {
            console.error('Erreur lors de la géolocalisation :', error);
        }
    });

    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const address = document.getElementById('addressInput').value;
        try {
            const coordinates = await getCoordinatesFromAddress(address);
            const cinemas = await cinemaFinder.getCinemasNearUser(10, 'fauteuils', coordinates);
            displayCinemaTable(cinemaListContainer, cinemas, coordinates);
        } catch (error) {
            console.error('Erreur lors de la recherche des cinémas :', error);
        }
    });
});
