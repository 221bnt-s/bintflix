
console.log("Bintflix hero & sections chargés !");


import { API_KEY, BASE_URL, IMG_URL } from './api.js';


export const moviesGrid = document.querySelector("#movies-grid");
export const seriesGrid = document.querySelector("#series-grid");
export const searchInput = document.querySelector("#search");
export const btnSeries = document.querySelector("#btn-series");
export const btnFilms = document.querySelector("#btn-films");
export const hero = document.querySelector("#hero");
export const heroTitle = document.querySelector("#hero-title");
export const heroOverview = document.querySelector("#hero-overview");


export const modal = document.querySelector("#modal");
export const closeBtn = document.querySelector("#close-modal");
export const modalBody = document.querySelector("#modal-body");



export function displayItems(items, container){
  container.innerHTML = "";
  if(!items || items.length === 0){
    container.innerHTML = "<p>Aucun résultat trouvé 😕</p>";
    return;
  }
  items.forEach(item => {
    const title = item.title || item.name;
    const card = document.createElement("div");
    
    
    card.setAttribute("data-id", item.id); 
    
    card.setAttribute("data-type", item.title ? 'movie' : 'tv'); 
    
    card.classList.add("min-w-[300px]", "rounded-sm", "bg-gray-800", "hover:scale-105", "transition-transform", "flex-shrink-0", "cursor-pointer");

    card.innerHTML = `
      <img src="${item.poster_path ? 'https://image.tmdb.org/t/p/w200' + item.poster_path : 'https://via.placeholder.com/200x300?text=Image+indisponible'}" 
           alt="${title}" class="rounded-t-lg">
      <div class="p-2">
        <h3 class="text-sm font-bold mb-1">${title}</h3>
        <p class="text-xs text-gray-400">⭐ ${item.vote_average?.toFixed(1) || '–'}/10</p>
      </div>
    `;
    container.appendChild(card);
  });
}




export function openModal(content) {
  modalBody.innerHTML = content;
  modal.classList.remove("hidden");
 
}

export function closeModal() {
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}


export function getTrailer(item) {
  const videos = item.videos?.results || [];
  return videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
}


