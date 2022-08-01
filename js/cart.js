// place to display products in cart page
let sectionCartItemsEl = document.getElementById('cart__items');
let productCollection = [];

function getProducts() {
    // calling API to take params we needed ( quantity, color )
    return fetch('http://localhost:3000/api/products/').then(res => res.json());
}

// use promises of the previous calling to :
getProducts().then(function (products) {
    productCollection = products;
    // have an array of products in local storage
    let productsFromLocalStorageArray = getProductsFromLocalStorage();
    // display all article in Local storage
    displayArticles(products, productsFromLocalStorageArray);
    // display if client's local storage is emplty
    displayEmptyCollection(productsFromLocalStorageArray);
    // calculate total price of theses products, and display It
    displayTotalPrice(productsFromLocalStorageArray);

    // managing event on click to make an order ('submit') 
    document.getElementById('order').addEventListener('click', function (e) {
        e.preventDefault()

        // get product Id
        let productIds = retrieveProductIds();
        // Create object wich have all form value wrote by client
        let contact = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value,
        };
        // check if every's data are correctly wrote
        if (!formIsValid(contact)) {
            return;
        }

        // make request to submit order
        submit(contact, productIds)
    })
});
// Push the product ID in an array "productIds" to use it for the purchase order
function retrieveProductIds() {
    let productIds = [];
    let products = getProductsFromLocalStorage();

    products.forEach(function (product) {
        productIds.push(product.id);
    });
    return productIds;
}
// make the order : needed all product Id in local storage, and all personnal data from forms
function submit(contact, productIds) {
    let params = {
        contact: contact,
        products: productIds
    }
    // make a POST to send data id
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        // stringiy all forms data
        body: JSON.stringify(params),
    }).then(function (stream) {
        return stream.json();
    }).then(function (response) {
        // delete local storage after submit, and redirect client to confirmation
        localStorage.removeItem('products');
        document.location = "confirmation.html?orderId=" + response.orderId;
    });
}
// show if client's local storage is empty
function displayEmptyCollection(articles) {
    if (articles.length === 0) {
        const elemPanierVide = `<div style="display:flex; margin:auto; justify-content:center"><p style="font-size:40px; padding: 30px">Votre panier est vide</p></div>`;
        const elem = document.querySelector("#cartAndFormContainer h1")
        elem.insertAdjacentHTML("afterend", elemPanierVide)
    }
}
// take products already existing in Local storage
function getProductsFromLocalStorage() {
    let productsFromLocalStorage = localStorage.getItem('products');
    // convert all products to an array
    return JSON.parse(productsFromLocalStorage);
}
// display Article existing in Local Storage
function displayArticles(products, productsFromLocalStorageArray) {
    let articles = [];

    // for each product, make an article, and add params chosen by client
    products.forEach(product => {
        productsFromLocalStorageArray.forEach(localProduct => {
            if (localProduct.id === product._id) {
                sectionCartItemsEl.appendChild(createArticle(product, localProduct.quantity, localProduct.color))
                articles.push(product);
            }
        });
    });
    // update the number of products
    displayLengthArticles(productsFromLocalStorageArray)
    // update deletion
    deleteItemFromLocalStorage()
    // update quantity
    managingQuantityByClient()
    return articles;
}
// Calculate and display Total price, for each change we'll call that function to update the price
function displayTotalPrice(articles) {
    let totalPrice = 0;
    articles.forEach(function (article) {
        const productFound = findProductById(article.id);
        totalPrice += productFound.price * article.quantity;
    });
    document.getElementById("totalPrice").textContent = totalPrice
}
// take all product id from an array
function findProductById(productId) {
    let productFound;
    productCollection.forEach(function (product) {
        if (product._id === productId) {
            productFound = product;
        }
    });
    return productFound;
}
// generate tree structure html
function createArticle(product, quantity, color) {
    let newArticle = document.createElement("article")
    newArticle.classList.add("cart__item")
    newArticle.dataset.id = product._id
    newArticle.dataset.color = color

    // Image
    let imageContainer = newArticle.appendChild(document.createElement("div"))
    imageContainer.classList.add("cart__item__img")
    let image = imageContainer.appendChild(document.createElement("img"))
    image.setAttribute('alt', product.altTxt)
    image.setAttribute('src', product.imageUrl)

    // Description
    let cartItemContainer = newArticle.appendChild(document.createElement("div"))
    cartItemContainer.classList.add("cart__item__content")
    let cartItemDescription = cartItemContainer.appendChild(document.createElement("div"))
    cartItemDescription.classList.add("cart__item__content__description")
    cartItemDescription.textContent = product.description

    // Settings
    let cartItemContentSetting = cartItemContainer.appendChild(document.createElement("div"))
    cartItemContentSetting.classList.add("cart__item__content__settings")

    // input quantity and add default attribute
    let cartItemQuantity = cartItemContentSetting.appendChild(document.createElement("div"))
    cartItemQuantity.classList.add("cart__item__content__settings__quantity")
    let quantitySettings = cartItemQuantity.appendChild(document.createElement("p"))
    quantitySettings.textContent = "Qté :"
    let quantityInput = cartItemQuantity.appendChild(document.createElement("input"))
    quantityInput.classList.add("itemQuantity")
    quantityInput.setAttribute('type', 'number')
    quantityInput.setAttribute('name', 'itemQuantity')
    quantityInput.setAttribute('min', '1')
    quantityInput.setAttribute('max', '100')
    quantityInput.setAttribute('value', quantity)

    // add a button to delete product
    let deleteItem = cartItemContentSetting.appendChild(document.createElement("button"))
    deleteItem.classList.add("deleteItem")
    deleteItem.setAttribute("id", "deleteItem")
    deleteItem.textContent = "Supprimer"

    return newArticle
}