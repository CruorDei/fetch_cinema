# fetch_cinema
# Projet : liste des cinémas

## Liens utiles

* [Api cinémas](https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api/)
* [Api adresse](https://adresse.data.gouv.fr/api-doc/adresse)

## Objectifs

* Envoyer des requêtes HTTP vers une api
* Créer des éléments HTML
* Découper le code en fonctions et classes
* Utiliser les mots-clé *async* et *await*

## Instructions

### 1. Afficher la liste des cinémas

Au chargement de la page, récupérer la liste des cinémas triés par nombre de fauteuils (on veut les cinémas qui ont le plus grand nombre de places en premier) renvoyés par l'API puis les afficher dans la page sous forme de liste (nom, adresse, ville).

### 2. Afficher les cinémas proches de la position de l'utilisateur

Au chargement de la page, récupérer tous les cinémas (toujours triés par nombre de fauteuils) proches de la position de l'utilisateur, dans un rayon de 10km puis les afficher dans la page.

Pour récupérer les cinémas proches d'une position il faut rajouter dans le paramètre where de la chaîne de requête : within_distance(geolocalisation, geom'POINT(7.75 48.58)', 10km)

### 3. Cinémas proches d'une adresse

Créer un formulaire de recherche avec un bouton pour se géolocaliser, un champ texte et un bouton.

Lorsque l'on clique sur le bouton "Se géolocaliser", on récupère la position de l'utilisateur avec la fonctionnalité de géolocalisation du navigateur. Cela met à jour le champ de recherche avec le contenu de l'adresse.

Lorsque l'on soumet le formulaire, on récupère les coordonnées (latitude et longitude) de l'adresse du champ de recherche et on recherche tous les cinémas dans un rayon de 10km de ces coordoonées (récupérées depuis le champ de recherche).

### 4. Tri par distance du cinéma

Au lieu de trier par rapport au nombre de fauteuils, on tri par rapport à la distance entre les cinémas et l'adresse recherchée.

```javascript
/**
 * Cette fonction renvoie la distance en km entre les 2 points passés en paramètres
 * 
 */
function haversine(lat1, lon1, lat2, lon2) {
    // Rayon de la Terre en kilomètres (approximatif)
    const earthRadius = 6371;

    // Conversion des degrés en radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Différence de latitude et de longitude
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Calcul de la distance en utilisant la formule de la haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = earthRadius * c;

    return distance;
}
```

### BONUS. Carte + liste (style airbnb)

Mettre en place une carte (type mapbox, openstreetmap, mapQuest...) sur la moitié de l'écran. Afficher tous les cinémas par rapport aux limites du rectangle de la carte qui est affichée. Lorsque l'on dézoome ou se déplace sur la carte, la liste des cinémas est mise à jour.

Sur l'autre moitié, afficher la liste des cinémas (nom, adresse, ville, distance par rapport à l'adresse). Lorsque l'on met à jour la carte ou l'adresse du formulaire de recherche, la liste est mise à jour.