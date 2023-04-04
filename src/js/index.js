const global = {
  currentPage: window.location.pathname,
  api: {
    apiKey: "9a665f1cf0b45e951f9cf773f746280e",
    apiUrl: "https://api.themoviedb.org/3/",
  },
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
    maxCountResults: 20,
  },
};

// display slideer movies
async function nowPlayingMovies() {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a class="slider-link" target="_blank" href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3 class="slider-rating">
          <i class="fa-regular fa-star"></i>
            ${movie.vote_average}
        </h3>
        <div class="slider-wrapper">
          <h3 class="slider-title">${movie.title}</h3>
          <p class="slider-subtitle">
            Release:
            <small class="subtitle-muted">${movie.release_date}</small>
          </p>
        </div>
      </a>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);
  });

  initSwiper();
}

/* swiper */
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true,
    },
    autoplay: {
      delay: 3000,
    },
  });
}
/* END swiper */

/* movie details swiper */
function initMovieDetailsSlider() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
}

// Make Request To Search
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();
  console.log(data);
  return data;
}

async function search() {
  const queryString = window.location.search;
  console.log("queryString", queryString);
  const urlParams = new URLSearchParams(queryString);

  console.log("urlParams", urlParams);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");
  console.log(global.search.term);

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      console.error("No result");
      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } if (global.search.term == "" || global.search.term == null) {
    const searchButton = document.querySelector('button[type="submit"]');
    global.search.term.addEventListener('input', searchButton.disabled = true);
  }
}

function displaySearchResults(results) {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");

    div.classList.add("card");

    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />`
            : `<div class="no-img"></div>`
        }
      <h3 class="list-item-rating">
          <i class="fa-regular fa-star"></i>
            ${result.vote_average}
          </h3>
        <div class="list-item-descr">
          <h3 class="list-item-title">${result.title || result.name}</h3>
        </div>
      </a>
    `;
    console.log(results);
    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${
          global.search.totalPages > 1
            ? global.search.maxCountResults * (global.search.page - 1) +
              results.length
            : results.length
        } of ${global.search.totalResults} Results for "${
      global.search.term
    }"</h2>

    document.querySelector("#search-results-heading").innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
      `;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("/movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <a class="list-item-link" href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://www.themoviedb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />`
          : `<div class="no-img"></div>`
      }
        <h3 class="list-item-rating">
          <i class="fa-regular fa-star"></i>
            ${movie.vote_average}
        </h3>
        <div class="list-item-descr">
          <h3 class="list-item-title">${movie.title}</h3>
          <p class="list-item-subtitle">
            Release:
            <small class="list-item-muted">${movie.release_date}</small>
          </p>
        </div>
      </a>
    `;

    document.querySelector(".popular-movies").appendChild(div);
  });
}

// display most popular TV Shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("/tv/popular");

  results.forEach((tv) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a class="list-item-link" href="tv-details.html?id=${tv.id}">
      ${
        tv.poster_path
          ? `<img src="https://www.themoviedb.org/t/p/w300${tv.poster_path}" alt="${tv.title}" />`
          : `<div class="no-img"></div>`
      }
        <h3 class="list-item-rating">
          <i class="fa-regular fa-star"></i>
            ${tv.vote_average}
          </h3>
        <div class="list-item-descr">
          <h3 class="list-item-title">${tv.name}</h3>
        </div>
      </a>
    `;

    document.querySelector(".popular-tv").appendChild(div);
  });
}

// display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="flex">
      <div class="details-card mr-9">
      <!-- Slider main container and our classes -->
      <div class="swiper card-image">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
          </div>
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
          </div>
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
          </div>
        </div>

        <div class="card-info">
          <svg class="details-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
            </path>
          </svg>
        </div>

        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
      </div>

      <div class="details-information">
        <div class="information-descrption">
          <h2 class="descrption-title">${movie.title}</h2>
          <h3 class="descrption-subtitle">${movie.overview}</h3>
          <h3 class="details-rating">
            <i class="fa-regular fa-star"></i>
            ${movie.vote_average}
          </h3>
          <h3 class="descrption-subtitle">Run Time</h3>
          <p>${movie.runtime} minutes</p>
          <h3 class="descrption-subtitle">Reliase Date:</h3>
          <p>${movie.release_date}</p>
          <h3 class="descrption-subtitle">Genres</h3>
          <p>${movie.genres[0].name}</p>
        </div>
      </div>
  `;

  document.querySelector("#movie-details").appendChild(div);

  initMovieDetailsSlider();
}

// display tv details
async function displayShowsDetails() {
  const tvId = window.location.search.split("=")[1];

  const tv = await fetchAPIData(`tv/${tvId}`);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="flex">
      <div class="details-card mr-9">
      <!-- Slider main container and our classes -->
      <div class="swiper card-image">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}"/>
          </div>
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}"/>
          </div>
          <div class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" alt="${tv.name}"/>
          </div>
        </div>

        <div class="card-info">
          <svg class="details-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
            </path>
          </svg>
        </div>

        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
      </div>

      <div class="details-information">
        <div class="information-descrption">
          <h2 class="descrption-title">${tv.name}</h2>
          <h3 class="descrption-subtitle">${tv.overview}</h3>
          <h3 class="details-rating">
            <i class="fa-regular fa-star"></i>
            ${tv.vote_average}
          </h3>
          <h3 class="descrption-subtitle">Episode Run Time</h3>
          <p>${tv.episode_run_time} minutes</p>
          <h3 class="descrption-subtitle">First Air Date:</h3>
          <p>${tv.first_air_date}</p>
          <h3 class="descrption-subtitle">Last Air Date:</h3>
          <p>${tv.last_air_date}</p>
          <h3 class="descrption-subtitle">Genres</h3>
          <p>${tv.genres[0].name}</p>
          <h3 class="descrption-subtitle">Status</h3>
          <p>${tv.status}</p>
        </div>
      </div>
  `;

  document.querySelector("#tv-details").appendChild(div);

  initMovieDetailsSlider();
}

// display pagination
function displayPagination() {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // step to next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;

    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // step to prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;

    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}



/* links */
const links = document.querySelectorAll(".nav-link");

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    document.querySelector(".nav-link.active").classList.remove("active");
    event.currentTarget.classList.add("active");
  });
});

/* tabs-content */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelector(".tabs");
  const tabsBtn = document.querySelectorAll(".tabs__btn");
  const tabsContent = document.querySelectorAll(".tabs__content");

  if (tabs) {
    tabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("tabs__btn")) {
        const tabsPath = e.target.dataset.tabsPath;
        tabsBtn.forEach((el) => el.classList.remove("tabs__btn--active"));
        document
          .querySelector(`[data-tabs-path="${tabsPath}"]`)
          .classList.add("tabs__btn--active");
        tabsHandler(tabsPath);
      }
    });
  }

  const tabsHandler = (path) => {
    tabsContent.forEach((el) => el.classList.remove("tabs__content--active"));
    document
      .querySelector(`[data-tabs-target="${path}"]`)
      .classList.add("tabs__content--active");
  };
});

/* spinner */
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      nowPlayingMovies();
      displayPopularMovies();
      displayPopularShows();
      break;
    case "/movies.html":
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowsDetails();
      break;
    case "/search.html":
      search();
      break;
  }
}

document.addEventListener("DOMContentLoaded", init); // инициализация слайдера при загрузке страницы
