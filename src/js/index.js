

const global = {
  currentPage: window.location.pathname,
  api: {
    apiKey: '9a665f1cf0b45e951f9cf773f746280e',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  }
};

// display slideer movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);
  })

  initSwiper();
}


/* swiper */
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    breakpoints: {
      1200: {
        slidesPerView: 4,
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
}
/* END swiper */

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

  return data;
}

async function search() {
  const queryString = window.location.search;
  console.log('queryString', queryString)
  const urlParams = new URLSearchParams(queryString);

  console.log('urlParams', urlParams);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  console.log(global.search.term);

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, page } = await searchAPIData();

    global.search.page = page;

    console.log(global.search.page)

    if (results.length === 0) {
      console.error('No result');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    console.log('Please enter search term!');
  }
}


function displaySearchResults(results) {
  document.querySelector('#search-results').innerHTML = '';

  results.forEach(result => {
    const div = document.createElement('div');

    div.classList.add('card');

    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${result.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />`
        : `<div>no image</div>`
      }"
      </a>
      <div>asdada</div>
    `;
    document.querySelector('.search-results').appendChild(div);
  })
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
  const { results } = await fetchAPIData('/movie/popular');

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie');
    div.innerHTML = `
      <a class="list-item-link" href="movie-details.html?id=${movie.id}">
      ${movie.poster_path
        ?
        `<img src="https://www.themoviedb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />`
        :
        `<div class="no-img"></div>`
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

    document.querySelector('.popular-movies').appendChild(div);

  })
}

// display most popular TV Shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('/tv/popular');

  results.forEach(tv => {
    const div = document.createElement('div');
    div.classList.add('tv');
    div.innerHTML = `
    <a class="list-item-link" href="movie-details.html?id=${movie.id}">
      ${tv.poster_path
        ?
        `<img src="https://www.themoviedb.org/t/p/w300${tv.poster_path}" alt="${tv.title}" />`
        :
        `<div class="no-img"></div>`
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

    document.querySelector('.popular-tv').appendChild(div);
  })
}




async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  console.log(movie)

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="flex">
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
  `;

  document.querySelector('#movie-details').appendChild(div);
}





/* button-group */
const buttons = document.querySelectorAll('.button');

buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();

    document.querySelector('.button.active').classList.remove('active');
    event.currentTarget.classList.add('active');
  })
})


/* spinner */
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}


function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}


function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/movies.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/search.html':
      search();
      break;
  }

}


document.addEventListener('DOMContentLoaded', init); // инициализация слайдера при загрузке страницы