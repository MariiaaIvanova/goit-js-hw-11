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
let page = 1;
displayedImagesCount = 0;


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


function onSearch(event) {
  event.preventDefault();
  page = 1;
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
    gallery.refresh();
    if (page > 2) {
      slowScroll();
    }
  } catch (error) {
    onFetchError(error);
  }
  
}

async function getImagesMarkup() {
  try {
    const { hits, totalHits } = await newsApiService.getImages();
    const totalPages = newsApiService.countTotalPages(totalHits);

    loadMoreBtn.show();
    loadMoreBtn.enable();

    console.log(page);
    console.log(totalPages);
    console.log(totalHits);
    
     if (totalHits === 0) {
      loadMoreBtn.hide();
      return Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (page > totalPages) {
      loadMoreBtn.hide();
      return Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    if (page === totalPages) {
     loadMoreBtn.hide();
      Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length === totalHits) {
      loadMoreBtn.hide();
        Notify.warning('These are all images for your request.');
    } 
 
    page += 1;
     
    return hits.reduce((markup, hit) => markup + createMarkup(hit), '');
    
  } catch (error) {
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