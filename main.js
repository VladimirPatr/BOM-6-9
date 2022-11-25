
const URLfresh = 'https://newsapi.org/v2/top-headlines?';
const URLseach = 'https://newsapi.org/v2/everything?';
// const KEY = 18b36daf782e4f12a128c47acfedcb99;
const select = document.querySelector('.header__select');
const freshContent = document.querySelector('.search-fresh__content');
const moreContent = document.querySelector('.search-more__content');
const searchInput = document.querySelector('.search-field');
const searchButton = document.querySelector('.search-icon');
const searchFreshSwction = document.querySelector('.search-fresh');
const searchSpan = document.querySelector('.search-fresh__span');

//функция рендера карточек Свежих новостей
const renderNews = (err, data, length) => {
    if (err) {
      console.warn(err, data);
      return;
    }
    let dataLength = data.articles.length;

    // for (let i = dataLength; i > 0; i--) {
    //        if (!(i%4)) {
    //         dataLength = i;
    //         break;
    //        } 
    //       }

      const newData = data.articles.slice(0, length);

      const template = document.createDocumentFragment();
      const news = newData.map(item => {
      const time = item.publishedAt;
      const years = time.slice(0,10);
      const hour =  time.slice(11,19);
  
      const card = document.createElement('div');
      card.className = 'search-fresh__item';
      card.innerHTML = `
      <div class="search__img">
          <img src='${item.urlToImage}' alt="" class="search__img">
      </div>
      <div class="search-item__wrapper">
          <a href="#" class="search__links"><img src="img/icon-arrow-search.svg" alt=""></a>
          <a href=${item.url} class="search__title">${item.title}</a>
          <p class="search__text">${item.description}</p>
          <div class="search__author-wrapper">
              <span class="search__data">${years}</span>
              <span class="search__time">${hour}</span>
              <span class="search__autor">${item.author}</span>
          </div>
      </div>
      `;
      return card;
    });
  
    template.append(...news);
    return template;
  };

//функция отправки запроса на сервер
const fetchRequest = async (postfix, URL, length, {
  method = 'get',
  callback,
  body,
  headers,
}) => {
  try {
    const options = {
      method,
    };

    if (body) options.body = JSON.stringify(body);
    if (headers) options.headers = headers;

    const response = await fetch(`${URL}${postfix}&apiKey=18b36daf782e4f12a128c47acfedcb99`, options);

    if (response.ok) {
      const data = await response.json();

      if (callback) return callback(null, data, length);
      return;
    }

    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  } catch (err) {
    return callback(err);
  }
};



// функция получения свежих новостей при загрузке
const initFresh = (country) =>{
  return Promise.all([
    fetchRequest(country, URLfresh, 8,{
            callback: renderNews,
        }),
    ]);
};

const country = 'country=ru';
initFresh(country).then(data=>{
  moreContent.innerHTML = '';
  moreContent.append(data[0]);
});



// функция отправки запроса на сервер для всех новостей
const init = (country, search) =>{
  return Promise.all([
    fetchRequest(country, URLfresh, 4,{
            callback: renderNews,
        }),
    fetchRequest(search, URLseach, 8, {
            callback: renderNews,
        })

    ]);
};

// Функция при вводе поиска в input
searchButton.addEventListener('click', () => {

  searchFreshSwction.style.display = 'block';

  const searchValue = searchInput.value;
  const search = `q=${searchValue}`;

  const selectValue = select.value;
  const country = `country=${selectValue}`;

  searchSpan.textContent = searchValue; 

init(country, search).then(data=>{
  moreContent.innerHTML = '';
  moreContent.append(data[0]);
  freshContent.innerHTML = '';
  freshContent.append(data[1])
  })
});