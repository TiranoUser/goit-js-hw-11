import axios from 'axios';
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '17088809-5618046dfb2c29fa4746c21d5';

export default class NewsService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getNews() {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    console.log('this.page: ', this.page);
    console.log(data);
    console.log(data.totalHits);

    if (this.page === 1 && data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    this.incrementPage();
    return data.hits;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
