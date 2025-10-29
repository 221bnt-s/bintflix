// js/ui.js

import { getPopular, searchMovies, getDetails } from './api.js';
import { 
  moviesGrid, seriesGrid, btnFilms, btnSeries, searchInput,
  hero, heroTitle, heroOverview, displayItems,
  modal, closeBtn, closeModal, openModal, getTrailer
} from './app.js';



document.addEventListener("DOMContentLoaded", () => {
  
  getPopular('movie', moviesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems);
  getPopular('tv', seriesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems);
  
  
  addModalClickListeners();
});


btnFilms.addEventListener("click", () => getPopular('movie', moviesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems));
btnSeries.addEventListener("click", () => getPopular('tv', seriesGrid, moviesGrid, hero, heroTitle, heroOverview, displayItems));


searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    const query = e.target.value.trim();
    if(query) searchMovies(query, moviesGrid, seriesGrid, displayItems);
  }
});





function handleCardClick(event) {

  const card = event.target.closest('[data-id]'); 
  
  if (card) {
    const id = card.getAttribute('data-id');
    const type = card.getAttribute('data-type'); 
    
    
    getDetails(id, type)
      .then(details => {
        if (details) {
         
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
          
         
          openModal(content);
        }
      })
      .catch(err => console.error("Erreur lors de l'ouverture du modal :", err));
  }
}


function addModalClickListeners() {
  moviesGrid.addEventListener('click', handleCardClick);
  seriesGrid.addEventListener('click', handleCardClick);
}



closeBtn.addEventListener("click", closeModal);


modal.addEventListener("click", (event) => {

  if (event.target.classList.contains("modal")) {
    closeModal();
  }
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

