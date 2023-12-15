// geolocation.js
export async function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
            error => reject(error.message)
        );
    });
}

export async function getAddressFromCoordinates(lat, lon) {
    const apiUrl = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
        return data.features[0].properties.label;
    } else {
        return null;
    }
}

export async function getCoordinatesFromAddress(address) {
    const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&type=housenumber&autocomplete=1`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.length > 0) {
        return {
            lat: data[0].y,
            lon: data[0].x
        };
    } else {
        return null;
    }
}
