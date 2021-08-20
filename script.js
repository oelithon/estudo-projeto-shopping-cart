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

// Função responsável por fazer requisição da API do Mercado Livre, buscando por 'computador';
// Com ela eu obtenho uma lista de produtos e extraio od dados de ID, Nome e Imagem de demostração;
// Faz appendChild() dos dados tratados na função createProductItemElement() e os insere em uma ol.
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

// Verifica se um elemento filho contém tag span com class='item__sku' e pega seu texto. Dessa forma foi possível obter o ID de um produto.
// Essa função está sendo chamada como parametro de getPriceInAPI() dentro do evento de click mais abaixo na página.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const ol = document.querySelector('.cart__items');

function sumTotal(price = 0) {
  const priceTotal = document.querySelector('.total-price');
  priceTotal.innerText = `Valor total: ${price}`;
}

// Salva lista do carrinho no Local Storage.
function cartItemLocalStorage() {
  localStorage.setItem('cartItems', ol.innerHTML);
}

const emptyCartButton = document.querySelector('.empty-cart');

function emptyCart() {
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/while
  // Utilizei um exemplo da codumentação para fazer a verificação dos filhos do elemento pai e removê-los ao clicar no botão Esvaziar Carrinho.
  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }

  // A função cartItemLocalStorage() foi chamada aqui para atualizar a ol após remover um produto.
  cartItemLocalStorage();
}

emptyCartButton.addEventListener('click', emptyCart);

// Função responsável por remover um item selecionado. Ela faz referência a cada li criada pela função createCartItemElement().
function cartItemClickListener(event) {
  event.target.remove();

  // A função cartItemLocalStorage() foi chamada aqui para atualizar a ol após remover um produto.
  cartItemLocalStorage();
}

ol.addEventListener('click', cartItemClickListener);

// A função cria listas a partir dos valores das chaves passadas de forma desestruturada em seu parâmetro, essa função está sendo chamada dentro da função getPriceInAPI() dentro de um appendChild().
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Faz requisição da API para obter ID, Nome e Preço salvando essas informações em um objeto;
// Faz chamada da função createCartItemElement() que usa esses dados para criar listas com os dados do produto selecionado no carrinho de compras;
// Faz appendChild() das listas criadas pela função createCartItemElement() em uma ol.
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
      cartItemLocalStorage(); // cartItemLocalStorage() foi chamada aqui para atualizar o Local Storage a cada item adicionado.
      sumTotal(item.salePrice);
    });
  });
}

// Evento de click, verifica se o alvo contém uma classe específica;
// Se sim, faz retorno da função getPriceInAPI() que recebeu como parâmetro a função getSkuFromProductItem() que tem como parametro uma eventTarget verificando o parentElement do alvo clicado.
document.addEventListener('click', (docEvent) => {
  if (docEvent.target.classList.contains('item__add') === true) {
    return getPriceInAPI(getSkuFromProductItem(docEvent.target.parentElement));
  }
});

window.onload = () => {
  getAPI();
  ol.innerHTML = localStorage.getItem('cartItems');
  sumTotal();
};
