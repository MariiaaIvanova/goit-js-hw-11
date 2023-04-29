import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './js/apiService';
import LoadMoreBtn from './js/loadMoreBtn';
import { refs } from './js/refs';


const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
// buttonSearch
refs.buttonSearch.addEventListener('click', onClickButton);

export default function onClickButton() {
  refs.buttonSearch.classList.add('is-click');

  setTimeout(() => {
    refs.buttonSearch.classList.remove('is-click');
  }, 2000);
}

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImages);
//  function onloadMore() {
//      NewsApiService.page += 1;
//     // simpleLightBox.destroy();
//     // simpleLightBox.refresh();

//     fetchImages(searchQuery, page, per_page)
//       .then(data => {
//         renderGallery(data.hits);
//         // simpleLightBox = new SimpleLightbox('.gallery a').refresh();

//         const totalPages = Math.ceil(data.totalHits / per_page);

//         if (page > totalPages) {
//           Notify.failure(
//             "We're sorry, but you've reached the end of search results.",
//           );
//         }
//       })
//       .catch(error => console.log(error));
// }
//   function checkIfEndOfPage() {
//   return (
//     window.innerHeight + window.pageYOffset >=
//     document.documentElement.scrollHeight
//   );
// }

//   function showLoadMorePage() {
//     if (checkIfEndOfPage()) {
//       onloadMore();
//     }
//   }
//   window.addEventListener('scroll', showLoadMorePage);



function onSearch(event) {
  event.preventDefault();
  newsApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  if ( newsApiService.query === '') {
    Notify.failure(
      'The search string cannot be empty. Please enter a search word.',
    );
    return;
  }
  newsApiService.resetPage();
  clearGalleryList();
  fetchImages();
}

async function fetchImages() {
  onClickButton();
  try {
    const markup = await getImagesMarkup();
    updateGalleryList(markup);
    slowScroll(0.2);
    gallery.refresh();
  } catch (error) {
    onFetchError(error);
  }
}

async function getImagesMarkup() {
  try {
    const { hits, totalHits } = await newsApiService.getImages();
    const totalHitsPerPage = newsApiService.incrementTotalHits();
    newsApiService.hits = totalHits;
    const remainder = newsApiService.leftImages();

    console.log(totalHits);
    console.log(totalHitsPerPage);
    console.log(remainder);

    if (hits.length === 0) {
      return Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
   
    } else if (hits.length === totalHitsPerPage) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      // refs.loadMoreBtn.classList.remove('is-hidden');
    } else if (hits.length === totalHits) {
      Notify.warning('These are all images for your request.');
    }
  

    if (remainder < totalHitsPerPage && remainder === 0) {
      loadMoreBtn.show();
      loadMoreBtn.hide();
      return Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
  }
  catch (error) {
    onFetchError(error);
  }
}

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function createMarkup({ largeImageURL, tags, webformatURL, likes, views, comments, downloads }) {
  return `
   <div class='photo__card'>
    <a href='${largeImageURL}' alt='${tags}' class='photo__link'>
     <img src='${webformatURL}' alt='${tags}' loading='lazy' class='photo__image' />
    </a>
        <div class='info overlay'>
      <p class='info-item'>
        <b>Likes</b>${likes}
      </p>
      <p class='info-item'>
        <b>Views</b>${views}
      </p>
      <p class='info-item'>
        <b>Comments</b>${comments}
      </p>
      <p class='info-item'>
        <b>Downloads</b>${downloads}
      </p>
    </div>
  </div>`;
}

function updateGalleryList(markup) {
  if (markup !== undefined) {
    loadMoreBtn.show();
    loadMoreBtn.enable();
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  }

}

function clearGalleryList() {
  refs.gallery.innerHTML = '';
}

function onFetchError(error) {
  if (newsApiService.key === '') {
    loadMoreBtn.hide();
    return Notify.failure('Error, invalid or missing API key');
  }
  if (!error.status) {
    loadMoreBtn.hide();
    return Notify.failure('Oops, something went wrong, please try again.');
  } 
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
