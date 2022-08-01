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