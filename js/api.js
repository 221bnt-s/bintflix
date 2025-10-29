// js/api.js

const API_KEY = '7edcc392043e6fe236d7b0328575dffb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Exporter les constantes pour les utiliser dans app.js
export { API_KEY, BASE_URL, IMG_URL };


export async function getPopular(type, container, moviesGrid, hero, heroTitle, heroOverview, displayItems){
  try{
    const res = await fetch(`${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=fr-FR&page=1`);
    const data = await res.json();

    // Affiche le hero seulement pour la première catégorie chargée (Movie)
    if(type === 'movie' && container === moviesGrid){
      const heroItem = data.results[0];
      hero.style.backgroundImage = `url(${IMG_URL + heroItem.backdrop_path})`;
      heroTitle.textContent = heroItem.title;
      heroOverview.textContent = heroItem.overview.length > 200 ? heroItem.overview.slice(0,200)+'...' : heroItem.overview;
    }

    displayItems(data.results, container);
  }catch(err){
    console.error("Erreur (getPopular) :", err);
  }
}

export async function searchMovies(query, moviesGrid, seriesGrid, displayItems){
  moviesGrid.innerHTML = seriesGrid.innerHTML = "<p>Recherche en cours...</p>";
  try{
    const [moviesRes, seriesRes] = await Promise.all([
      fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`),
      fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`)
    ]);
    const movies = await moviesRes.json();
    const series = await seriesRes.json();
    displayItems(movies.results, moviesGrid);
    displayItems(series.results, seriesGrid);
  }catch(err){
    console.error("Erreur (searchMovies) :", err);
  }
}

export async function getDetails(id, type = 'movie') {
  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos&language=fr-FR`;

  try {
    const response = await fetch(url);
    const item = await response.json();
    return item;
  } catch (error) {
    console.error("Erreur (getDetails) :", error);
    return null;
  }
}