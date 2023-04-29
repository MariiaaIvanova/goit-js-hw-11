import axios from 'axios';

const API_KEY = '35770309-78fa01c385455366c0f1ba6fe';
const URL = 'https://pixabay.com/api';

export default class NewsApiService {
  constructor(total = 0, totalHits = 0) {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = totalHits;
    this.total = total;
    this.key = API_KEY;
    this.remainder = 0;
    this.per_page = 40;
  }

  async getImages() {
    const { data } = await axios.get(
      `${URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );

    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.total = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newHits) {
    this.totalHits = newHits;
  }

  incrementTotalHits() {
    return (this.total += this.per_page);
  }

  leftImages() {
    return (this.remainder = this.totalHits - this.total);
  }
}

