// js/ui.js

import { getPopular, searchMovies, getDetails } from './api.js';
import { 
  moviesGrid, seriesGrid, btnFilms, btnSeries, searchInput,
  hero, heroTitle, heroOverview, displayItems,
  modal, closeBtn, closeModal, openModal, getTrailer
} from './app.js';


// --- 1. Chargement initial ---
document.addEventListener("DOMContentLoaded", () => {
  // Les fonctions API ont besoin de paramètres supplémentaires maintenant
  getPopular('movie', moviesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems);
  getPopular('tv', seriesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems);
  
  // Appliquer les écouteurs de modal au chargement
  addModalClickListeners();
});

// --- 2. Événements des boutons ---
btnFilms.addEventListener("click", () => getPopular('movie', moviesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems));
btnSeries.addEventListener("click", () => getPopular('tv', seriesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems));

// --- 3. Événement de Recherche ---
searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    const query = e.target.value.trim();
    if(query) searchMovies(query, moviesGrid, seriesGrid, displayItems);
  }
});


// --- 4. Logique du MODAL ---

/** Gère l'ouverture du modal lorsque l'utilisateur clique sur une carte de film/série. */
function handleCardClick(event) {
  // 'closest' trouve l'élément parent qui a l'attribut 'data-id'
  const card = event.target.closest('[data-id]'); 
  
  if (card) {
    const id = card.getAttribute('data-id');
    const type = card.getAttribute('data-type'); 
    
    // 1. Récupérer les détails
    getDetails(id, type)
      .then(details => {
        if (details) {
          // 2. Préparer le contenu
          const trailer = getTrailer(details);
          const trailerHTML = trailer 
            ? `
            <h3 class="text-xl font-bold mt-4 mb-2">Bande-annonce</h3>
            <div class="aspect-w-16 aspect-h-9">
              <iframe
                class="w-full"
                height="300"
                src="https://www.youtube.com/embed/${trailer.key}"
                frameborder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>`
            : '<p>Bande-annonce non disponible.</p>';

          const content = `
            <h2 class="text-3xl font-bold">${details.title || details.name}</h2>
            <p class="text-gray-400 mt-1 mb-4">Note: ⭐ ${details.vote_average?.toFixed(1) || '–'}/10</p>
            <p>${details.overview || 'Pas de résumé disponible.'}</p>
            ${trailerHTML}
          `;
          
          // 3. Ouvrir le modal
          openModal(content);
        }
      })
      .catch(err => console.error("Erreur lors de l'ouverture du modal :", err));
  }
}

/** Ajoute les écouteurs de clic pour les deux conteneurs de cartes */
function addModalClickListeners() {
  moviesGrid.addEventListener('click', handleCardClick);
  seriesGrid.addEventListener('click', handleCardClick);
}


// --- Fermeture du Modal ---

// Fermer avec le bouton X
closeBtn.addEventListener("click", closeModal);

// Fermer en cliquant sur l'overlay
modal.addEventListener("click", (event) => {
  // Vérifie si l'élément cliqué est le conteneur principal du modal
  if (event.target.classList.contains("modal")) {
    closeModal();
  }
});

// Fermer avec la touche Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

