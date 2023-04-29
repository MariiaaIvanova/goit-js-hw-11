export default class LoadMoreBtn {
  constructor({ selector, isHidden = true }) {
  //  constructor({ selector, isHidden = false }) {
    this.button = this.getButton(selector);

    
    isHidden && this.hide();
  }

  

  getButton(selector) {
    return document.querySelector(selector);
  }

  disable() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }

  hide() {
    this.button.classList.add('hidden');
  }

  show() {
    this.button.classList.remove('hidden');
  }
   empty() {
        this.button.disabled = true;
        this.button.textContent = 'Nothing to show';
  }
  
}

// export default class LoadMoreBtn {
//   constructor({ selector, hidden = false }) {
//     this.refs = this.getRefs(selector);

//     hidden && this.hide();
//   }

//   getRefs(selector) {
//     const refs = {};
//     refs.button = document.querySelector(selector);
//     refs.label = refs.button.querySelector('.label');
//     return refs;
//   }

//   enable() {
//     this.refs.button.disabled = false;
//     this.refs.label.textContent = 'Load more';
//   }

//   disable() {
//     this.refs.button.disabled = true;
//     this.refs.label.textContent = 'Loading...';
//   }

//   show() {
//     this.refs.button.classList.remove('is-hidden');
//   }

//   hide() {
//     this.refs.button.classList.add('is-hidden');
//   }
// }