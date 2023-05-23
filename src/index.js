// import axios from 'axios';
import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

import NewsService from './components/NewsService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  photoWrapper: document.querySelector('.gallery'),
};

const newsService = new NewsService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;

  const value = form.elements.searchQuery.value.trim();
  if (value === '') Notiflix.Notify.warning('Введите данные');
  else {
    newsService.searchQuery = value;
    newsService.resetPage();

    loadMoreBtn.show();
    clearNewsList();
    fetchArticles().finally(() => form.reset());
  }
}

async function fetchArticles() {
  loadMoreBtn.disable();

  try {
    const markup = await getArticlesMarkup();
    if (!markup) throw new Error('No data');
    updateNewsList(markup);
  } catch (err) {
    onError(err);
  }

  loadMoreBtn.enable();
}

async function getArticlesMarkup() {
  try {
    const articles = await newsService.getNews();

    if (!articles) {
      loadMoreBtn.hide();
      return '';
    }
    if (articles.length === 0) throw new Error('No data');

    return articles.reduce(
      (markup, article) => markup + createMarkup(article),
      ''
    );
  } catch (err) {
    onError(err);
  }
}

function createMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card"  >
   <img src="${webformatURL}" width="300" height="200" alt="${tags}" title="${tags}" loading="lazy" /> 
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
       <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
     <b>${views}</b> 
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
     <b>${downloads}</b> 
    </p>
  </div>
</div> `;
}

function updateNewsList(markup) {
  refs.photoWrapper.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.photoWrapper.innerHTML = '';
}
// test
function onError(err) {
  // console.error(err);
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  loadMoreBtn.hide();
  // refs.photoWrapper.innerHTML = '<p>Not found!</p>';
}
