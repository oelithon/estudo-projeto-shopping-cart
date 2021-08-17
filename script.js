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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const listItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  listItems.appendChild(li);
  return li;
}

function getPriceInAPI(searchId) {
  const productPrice = fetch(`https://api.mercadolibre.com/items/${searchId}`);
  productPrice.then((response) => {
    const dataBase = response.json();
    dataBase.then((data) => {
      // const item = {
      //   sku: data.id,
      //   name: data.title,
      //   salePrice: data.price,
      // };
      createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price });
    });
  });
}

const cartList = () => {
  const selectItem = document.querySelectorAll('.item__add');
  console.log(selectItem);
  selectItem.forEach((button) => {
    button.addEventListener('click', (event) => {
      const searchId = event.target.parentNode.firstChild.innerText;
      getPriceInAPI(searchId);
    });
  });
};

window.onload = () => {
  getAPI();
  cartList();
};
