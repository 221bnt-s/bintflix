    console.log("Netflex hero & sections chargés !");

    const burger = document.querySelector("#burger");
    const navMenu = document.querySelector("#nav-menu");

    burger.addEventListener("click", () => {
  navMenu.classList.toggle("hidden");
});


    const API_KEY = '7edcc392043e6fe236d7b0328575dffb';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/original';

    const moviesGrid = document.querySelector("#movies-grid");
    const seriesGrid = document.querySelector("#series-grid");
    const searchInput = document.querySelector("#search");
    const btnSeries = document.querySelector("#btn-series");
    const btnFilms = document.querySelector("#btn-films");
    const hero = document.querySelector("#hero");
    const heroTitle = document.querySelector("#hero-title");
    const heroOverview = document.querySelector("#hero-overview");

    // --- Chargement initial ---
    document.addEventListener("DOMContentLoaded", () => {
      getPopular('movie', moviesGrid);
      getPopular('tv', seriesGrid);
    });

    // --- Boutons ---
    btnFilms.addEventListener("click", () => getPopular('movie', moviesGrid));
    btnSeries.addEventListener("click", () => getPopular('tv', seriesGrid));

    // --- Recherche ---
    searchInput.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        const query = e.target.value.trim();
        if(query) searchAll(query);
      }
    });

    async function getPopular(type, container){
      try{
        const res = await fetch(`${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=fr-FR&page=1`);
        const data = await res.json();

        // Affiche le hero seulement pour la première catégorie chargée
        if(type === 'movie' && container === moviesGrid){
          const heroItem = data.results[0];
          hero.style.backgroundImage = `url(${IMG_URL + heroItem.backdrop_path})`;
          heroTitle.textContent = heroItem.title;
          heroOverview.textContent = heroItem.overview.length > 200 ? heroItem.overview.slice(0,200)+'...' : heroItem.overview;
        }

        displayItems(data.results, container);
      }catch(err){
        console.error("Erreur :", err);
      }
    }

    async function searchAll(query){
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
        console.error("Erreur recherche :", err);
      }
    }

    function displayItems(items, container){
      container.innerHTML = "";
      if(!items || items.length === 0){
        container.innerHTML = "<p>Aucun résultat trouvé 😕</p>";
        return;
      }
      items.forEach(item => {
        const title = item.title || item.name;
        const card = document.createElement("div");
        card.classList.add("min-w-[200px]", "rounded-sm", "bg-gray-800", "hover:scale-105", "transition-transform", "flex-shrink-0");

        card.innerHTML = `
          <img src="${item.poster_path ? 'https://image.tmdb.org/t/p/w300' + item.poster_path : 'https://via.placeholder.com/200x300?text=Image+indisponible'}" 
               alt="${title}" class="rounded-t-lg">
          <div class="p-2">
            <h3 class="text-sm font-bold mb-1">${title}</h3>
            <p class="text-xs text-gray-400">⭐ ${item.vote_average?.toFixed(1) || '–'}/10</p>
          </div>
        `;
        container.appendChild(card);
      });
    }

