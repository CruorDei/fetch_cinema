import { haversine } from './haversine.js';

export default class CinemaFinder {
    constructor() {
        this.apiUrl = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records';
    }

    async getCinemasNearUser(limit = 10, sortMode = 'fauteuils', userPosition = null) {
        let apiUrlWithParams = `${this.apiUrl}?limit=${limit}`;

        if (userPosition) {
            const whereClause = `within_distance(geolocalisation, geom'POINT(${userPosition.lon} ${userPosition.lat})', 10km)`;
            apiUrlWithParams += `&where=${encodeURIComponent(whereClause)}`;
        }

        const response = await fetch(apiUrlWithParams);
        const data = await response.json();

        const cinemas = data.results.map(result => this.mapCinemaResult(result));

        if (userPosition) {
            cinemas.forEach(cinema => {
                cinema.distance = haversine(userPosition.lat, userPosition.lon, cinema.geolocalisation.lat, cinema.geolocalisation.lon);
            });
        }

        if (sortMode === 'distance') {
            cinemas.sort((a, b) => a.distance - b.distance);
        } else {
            cinemas.sort((a, b) => b.fauteuils - a.fauteuils);
        }

        return cinemas;
    }

    mapCinemaResult(result) {
        return {
            nom: result.nom,
            adresse: result.adresse,
            commune: result.commune,
            fauteuils: result.fauteuils,
            seances: result.seances,
            entrees_2022: result.entrees_2022,
            genre: result.genre,
            geolocalisation: result.geolocalisation,
            distance: 0,
        };
    }
}
