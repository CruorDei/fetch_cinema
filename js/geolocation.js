export async function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
            error => reject(error.message)
        );
    });
}

export async function getAdministrativeZone(lat, lon) {
    const apiUrl = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
        return data.features[0].properties.context;
    } else {
        return null;
    }
}
