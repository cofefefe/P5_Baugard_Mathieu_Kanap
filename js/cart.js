// place to display products in cart page
let sectionCartItemsEl = document.getElementById('cart__items');
let productCollection = [];
//***** Managing datas, retrieve all product from ls, IDs, use promise *****//
// Push the product ID in an array "productIds" to use it for the purchase order
function retrieveProductIds() {
    let productIds = [];
    let products = getProductsFromLocalStorage();

    products.forEach(function (product) {
        productIds.push(product.id);
    });
    return productIds;
}
// take products already existing in Local storage
function getProductsFromLocalStorage() {
    let productsFromLocalStorage = localStorage.getItem('products');
    // convert all products to an array
    return JSON.parse(productsFromLocalStorage);
}
function getProducts() {
    // calling API to take params we needed ( quantity, color )
    return fetch('http://localhost:3000/api/products/').then(res => res.json());
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
        let quantity = document.querySelector('.itemQuantity')
        console.log(quantity.value)
        // make request to submit order
        if(quantity.value > 0){
            submit(contact, productIds)
        }
        if(quantity.value < 0){
            alert('La quantité ne peut comprendre des valeurs négatives')
        }
    })
});

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
//***** Managing display *****//
// show if client's local storage is empty
function displayEmptyCollection(articles) {
    if (articles.length === 0) {
        const elemPanierVide = `<div style="display:flex; margin:auto; justify-content:center"><p style="font-size:40px; padding: 30px">Votre panier est vide</p></div>`;
        const elem = document.querySelector("#cartAndFormContainer h1")
        elem.insertAdjacentHTML("afterend", elemPanierVide)
    }
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
// display how many articles client chosen
function displayLengthArticles(productsFromLocalStorageArray) {
    let totalArticle = 0;
    let LengthArticlesEl = document.getElementById('totalQuantity')
    productsFromLocalStorageArray.forEach(function (product) {
        totalArticle += product.quantity;

    });
    LengthArticlesEl.textContent = totalArticle;
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
    cartItemDescription.textContent = product.name
    let description = document.createElement("div")
    cartItemDescription.appendChild(description)
    description.textContent = product.description
    
    // Settings
    let cartItemContentSetting = cartItemContainer.appendChild(document.createElement("div"))
    cartItemContentSetting.classList.add("cart__item__content__settings")
    cartItemContentSetting.textContent = product.price + '€' 
  
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
//***** Managing local storage's data by user *****//
// Managing quantity by client, in cart page
function managingQuantityByClient() {
    let btnClientManageQuantity = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < btnClientManageQuantity.length; k++) {
        let btnClientManageQuantity = document.querySelectorAll(".itemQuantity");
        // event listener, if client is changing input's value :
        btnClientManageQuantity[k].addEventListener("change", (event) => {
            event.preventDefault();
            let quantityEl = event.target;
            let productEl = quantityEl.closest('article');

            let productId = productEl.dataset.id;
            let productColor = productEl.dataset.color;
            let quantity = parseInt(quantityEl.value);

            // change only the element chosen
            let productsFromLocalStorageArray = getProductsFromLocalStorage();
            // Search what product was modified
            const productFromLocalStorage = productsFromLocalStorageArray.find((product) => {
                return product.id === productId && product.color === productColor;
            });
            
            if(quantity < 0){
                
                alert('La quantité ne peut accepter des valeurs négatives')
                
            }
            // Change quantity
            productFromLocalStorage.quantity = quantity;
            localStorage.setItem("products", JSON.stringify(productsFromLocalStorageArray));

            // Refresh statistics
            displayTotalPrice(productsFromLocalStorageArray);
            displayLengthArticles(productsFromLocalStorageArray);
        })
    }
}
// Deletion product by client
function deleteItemFromLocalStorage() {
    // take deletion button
    let btnDeleteItemFromLocalStorage = document.querySelectorAll('.deleteItem')

    // for each button :
    btnDeleteItemFromLocalStorage.forEach(btn => {
        // Listenening event client
        btn.addEventListener("click", (e) => {
            let articleEl = e.target.closest('article');
            const productId = articleEl.dataset.id;
            const color = articleEl.dataset.color;

            // filter method to select individual product
            // 1. Delete product from local storage
            let productsFromLocalStorageArray = getProductsFromLocalStorage();
            let productsFromLocalStorageArrayUpdated = productsFromLocalStorageArray.filter(product => {
                if (productId === product.id && color === product.color) {
                    return false
                } else {
                    return true;
                }
            });
            localStorage.setItem("products", JSON.stringify(productsFromLocalStorageArrayUpdated));

            // 2. delete element from the dom
            articleEl.remove();

            // 3. Display empty message if the collection is empty
            displayEmptyCollection(productsFromLocalStorageArrayUpdated);

            // 4. Refresh statistics
            displayTotalPrice(productsFromLocalStorageArrayUpdated);
            displayLengthArticles(productsFromLocalStorageArrayUpdated);
        })
    })
}
//***** Handling data forms *****//
// Params regex
let regexEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9-_]+[.]{1}[a-z]{2,10}$')
let regexName = new RegExp('^[a-zA-Z,.-]{2,20}$')
let regexAddress = new RegExp("[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+")
// Email validation
function clientEmailVerification(contact) {
    let emailErrorMsg = document.getElementById("emailErrorMsg")
    if (regexEmail.test(contact.email) === false) {
        emailErrorMsg.textContent = 'Veuillez saisir une adresse Email valide';
        return false;
    } else {
        emailErrorMsg.textContent = '';
    }
    return true;
}
// name validation
function clientFirstNameVerification(contact) {
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
    if (regexName.test(contact.firstName) === false) {
        firstNameErrorMsg.textContent = 'Veuillez saisir un prénom valide'
        return false
    } else {
        firstNameErrorMsg.textContent = ''
    }
    return true
}
function clientLastNameVerification(contact) {
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
    if (regexName.test(contact.lastName) === false) {
        lastNameErrorMsg.textContent = 'Veuillez saisir un nom valide'
        return false
    } else {
        lastNameErrorMsg.textContent = ''
    }
    return true
}
// Address validation
function clientAddressVerification(contact) {
    let addressErrorMsg = document.getElementById("addressErrorMsg")
    if (regexAddress.test(contact.address) === false) {
        addressErrorMsg.textContent = 'Veuillez saisir une adresse valide'
        return false
    } else {
        addressErrorMsg.textContent = ''
    }
    return true
}
// City validation
function validateClientCity(contact) {
    let cityErrorMsg = document.getElementById("cityErrorMsg");
    if (regexName.test(contact.city) === false) {
        cityErrorMsg.textContent = 'Veuillez saisir une ville valide'
        return false
    } else {
        cityErrorMsg.textContent = ''
    }
    return true
}
// check if all form are valid thanks to regex
function formIsValid(contact) {

    let formIsValid = true;

    if (!validateClientCity(contact)) {
        formIsValid = false;
    }
    if (!clientAddressVerification(contact)) {
        formIsValid = false;
    }
    if (!clientFirstNameVerification(contact)) {
        formIsValid = false;
    }
    if (!clientLastNameVerification(contact)) {
        formIsValid = false;
    }
    if (!clientEmailVerification(contact)) {
        formIsValid = false;
    }
    return formIsValid;
}