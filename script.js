function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getAPI() {
  const mercadoLivreAPI = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  mercadoLivreAPI.then((response) => {
    const dataBase = response.json();
    dataBase.then((data) => {
      data.results.forEach((product) => {
        const item = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        const sectionItems = document.querySelector('.items');
        sectionItems.appendChild(createProductItemElement(item));
      });
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getPriceInAPI(searchId) {
  const productPrice = fetch(`https://api.mercadolibre.com/items/${searchId}`);
  productPrice.then((response) => {
    const dataBase = response.json();
    dataBase.then((product) => {
      const item = {
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      };
      const listItems = document.querySelector('.cart__items');
      listItems.appendChild(createCartItemElement(item));
    });
  });
}

document.addEventListener('click', (docEvent) => {
  if (docEvent.target.classList.contains('item__add') === true) {
    return getPriceInAPI(getSkuFromProductItem(docEvent.target.parentElement));
  }
});

window.onload = () => {
  getAPI();
};
