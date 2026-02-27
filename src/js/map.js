/**
 * ETML
 * Auteur       : Néo Darbellay, David Sottas et Aaron Vichery
 * Date         : 23.01.2026 (Création de ce fichier le 06.02.2026, mais il était dans une balise <script> de base)
 * Description  : Création et initialisation de la carte créative
 */

// Création de la map
const map = L.map("map", {
  center: [20, 0],
  zoom: 2,
  minZoom: 2,
  maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
  maxBoundsViscosity: 1.0,
});

// Ajout de l'arrière plan de la carte
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
  },
).addTo(map);

// Création des différents pins
const pinNatural = L.icon({
  iconUrl: "/ressources/images/marker-green.png",

  iconSize: [25, 41],
  iconAnchor: [25 / 2, 41],
});

const pinCultural = L.icon({
  iconUrl: "/ressources/images/marker-yellow.png",

  iconSize: [25, 41],
  iconAnchor: [25 / 2, 41],
});
const pinMixed = L.icon({
  iconUrl: "/ressources/images/marker-blue.png",

  iconSize: [25, 41],
  iconAnchor: [25 / 2, 41],
});

const pinSelected = L.icon({
  iconUrl: "/ressources/images/marker-red.png",

  iconSize: [25, 41],
  iconAnchor: [25 / 2, 41],
});

// Création du groupe de markers
const markerCluster = L.markerClusterGroup();
const markers = [];

// Le marker qui est sélectionné (null si aucun ne l'est)
let markerSelected = null;

// Lecture des données du fichier json
fetch("./ressources/data/world-heritage-list.json")
  .then((result) => result.json())
  .then((data) => {
    data.forEach((site) => {
      // Choix de l'icône utilisé pour les pins
      let pinChosen;

      if (site.category == "Natural") {
        pinChosen = pinNatural;
      } else if (site.category == "Cultural") {
        pinChosen = pinCultural;
      } else {
        pinChosen = pinMixed;
      }

      // Création du pin actuel
      let marker = L.marker([site.coordinates.lat, site.coordinates.lon], {
        icon: pinChosen,
        title: site.site,
      });

      // Ajout de l'icône et la catégorie en tant que propriétés d'objet pour une utilisation future.
      marker.originalIcon = pinChosen;
      marker.category = site.category;

      // Création du contenu du menu de droite
      const panelContent = /* HTML */ `
        <h2>${site.site}</h2>
        <small style="color: gray">${site.category}</small>
        <hr />
        <p>${site.short_description}</p>
        <button style="padding: 12px">Marquer comme visité</button>
      `;

      // Écoute de l'événement "click"
      marker.on("click", () => {
        // Mettre à jour le menu de droite avec le contenu lié à ce pin
        document.getElementById("info-panel").innerHTML = panelContent;

        // Réinitialisation de l'icône de l'ancien pin sélectionné
        if (markerSelected && markerSelected !== marker) {
          markerSelected.setIcon(markerSelected.originalIcon);
        }

        // Sélection du pin
        marker.setIcon(pinSelected);
        markerSelected = marker;

        // Zoom sur le pin
        markerCluster.zoomToShowLayer(marker, () => {
          map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), {
            animate: true,
          });
        });
      });

      // Ajout des pins dans les groupes de markers
      markerCluster.addLayer(marker);
      markers.push(marker);
    });

    // Ajout des pins à la carte
    map.addLayer(markerCluster);

    // Création de la barre de recherche
    L.control
      .pinSearch({
        position: "topright",
        placeholder: "Recherche...",
        buttonText: "Recherche",
        layerToSearch: markerCluster,
        onSearch: function (query) {
          // Si on essaie de faire une recherche vide, annuler la recherche
          if (query == undefined || query == null) {
            return;
          }

          // Trouver le pin concerné
          const marker = markers.find((m) =>
            m.options.title.toLowerCase().includes(query.toLowerCase()),
          );

          // Envoyer un message d'alerte si aucun pin n'a été trouvé
          if (!marker) {
            alert("Aucun résultat");
            return;
          }

          // Zoom sur le pin
          markerCluster.zoomToShowLayer(marker, function () {
            marker.fire("click");

            map.setView(marker.getLatLng(), Math.max(map.getZoom(), 6), {
              animate: true,
            });
          });
        },
        searchBarWidth: "200px",
        searchBarHeight: "30px",
        maxSearchResults: 10,
      })
      .addTo(map);
  });

// Si la carte a été cliqué, enlever la sélection du pin actuel
map.on("click", () => {
  if (markerSelected) {
    markerSelected.setIcon(markerSelected.originalIcon);
    markerSelected = null;
  }

  document.getElementById("info-panel").innerHTML = /* HTML */ `
    <h3>Veuillez sélectionner un site</h3>
    <p>Cliquez sur un site pour voir sa description</p>
  `;
});

const filterSelect = document.getElementById("filter-category");

// Si les filtres ont été changé, modifier les pins visible
filterSelect.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;

  // Effacer les pins
  markerCluster.clearLayers();

  // Rajouter les bon pins
  markers.forEach((marker) => {
    if (selectedCategory === "all" || marker.category === selectedCategory) {
      markerCluster.addLayer(marker);
    }
  });

  // enlever la sélection du pin actuel
  if (markerSelected) {
    markerSelected.setIcon(markerSelected.originalIcon);
    markerSelected = null;
  }

  document.getElementById("info-panel").innerHTML = /* HTML */ `
    <h3>Veuillez sélectionner un site</h3>
    <p>Cliquez sur un site pour voir sa description</p>
  `;
});
