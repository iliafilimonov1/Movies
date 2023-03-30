

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
async function nowPlayingMovies() {
  const { results } = await fetchAPIData('movie/now_playing');

  console.log(results)

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a class="slider-link href="movie-details.html?id=${movie.id}">
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

    document.querySelector('.swiper-wrapper').appendChild(div);
  })

  initSwiper();
}


/* swiper */
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    autoplay: {
      delay: 2000,
    }
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
    const { results, page, total_pages, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

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
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

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

    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
      `

    document.querySelector('#search-results').appendChild(div);
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
  const { results } = await fetchAPIData('/movie/popular');

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('card');
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
    div.classList.add('card');
    div.innerHTML = `
    <a class="list-item-link" href="movie-details.html?id=${tv.id}">
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


function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  // disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // step to next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;

    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // step to prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;

    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
}

/* links */
const links = document.querySelectorAll('.nav-link');

links.forEach(link => {
  link.addEventListener('click', event => {
    document.querySelector('.nav-link.active').classList.remove('active');
    event.currentTarget.classList.add('active');
  })
})

/* tabs-content */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelector('.tabs');
  const tabsBtn = document.querySelectorAll('.tabs__btn');
  const tabsContent = document.querySelectorAll('.tabs__content');

  if (tabs) {
    tabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('tabs__btn')) {
        const tabsPath = e.target.dataset.tabsPath;
        tabsBtn.forEach(el => el.classList.remove('tabs__btn--active'));
        document.querySelector(`[data-tabs-path="${tabsPath}"]`).classList.add('tabs__btn--active');
        tabsHandler(tabsPath);
      }
    })
  }

  const tabsHandler = path => {
    tabsContent.forEach(el => el.classList.remove('tabs__content--active'));
    document.querySelector(`[data-tabs-target="${path}"]`).classList.add('tabs__content--active');
  }

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
      nowPlayingMovies();
      displayPopularMovies();
      displayPopularShows();
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