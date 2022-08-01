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