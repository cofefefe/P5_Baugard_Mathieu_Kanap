let site = document.location;
let link = new URL(site)
let productId = link.searchParams.get("id");

// take API's data depending on the chosen product
fetch('http://localhost:3000/api/products/' + productId)
    .then(res => res.json())
    .then((product) => {

        // Show image //
        let img = document.createElement('img')
        img.src = product.imageUrl
        img.alt = product.altTxt;
        let itemImg = document.querySelector('.item__img');
        itemImg.appendChild(img);

        // Show description //
        let description = document.getElementById('description');
        description.textContent = product.description;

        // Show price product //
        let price = document.getElementById('price')
        price.textContent = product.price

        // show product name //
        let title = document.querySelector('h1')
        title.textContent = product.name
        console.log(title)

        // Colors variation product //
        let colors = document.getElementById('colors');
        for (let color of product.colors) {
            let option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colors.appendChild(option);
        }
    });


let addToCartButton = document.getElementById("addToCart")

// Add the Id, quantity and color selected by client to the object " productToAddInLocalStorage "
function addProductParam() {
addToCartButton.addEventListener("click", () => {

    let quantitySelected = parseInt(document.getElementById("quantity").value);
    let colorSelected = document.getElementById('colors').value
    // define client's params
    let productToAddInLocalStorage =
        {
            id: productId,
            quantity: quantitySelected,
            color: colorSelected
        }

    // On contrôle les données saisies
    if (areFormDataValid(productToAddInLocalStorage) === false) {
        return;
    }

    // add product to the local storage with their new params
    addProductInLocalStorage(productToAddInLocalStorage);

    // Redirect to the cart page after adding an item to ls
    document.location.href = "cart.html";
})
}
addProductParam()

function areFormDataValid(productToAddInLocalStorage) {
    if (productToAddInLocalStorage.color === '') {
        alert('Mauvaise couleur');
        return false;
    }

    if (productToAddInLocalStorage.quantity < 0) {
        alert('La quantité ne peut accepter des valeurs négatives');
        return false;
    }

    return true;
}

// make an array of the local storage, empty array if LS is empty, an object " products " is push if there's something in ls
function getProductsFromLocalStorage() {
    let products = localStorage.getItem("products")
    if (products == null) {
        return []
    } else {
        return JSON.parse(products);
    }
}

// Add product selected by client to the Local Storage
function addProductInLocalStorage(productToAddInLocalStorage) {
    // take products already in LS
    let productsFromLocalStorage = getProductsFromLocalStorage();

    // May this product is already existing in ls ?
    let productKeyInLocalStorage = findProductKeyInLocalStorage(productToAddInLocalStorage, productsFromLocalStorage);

    // Update " products " with the new item, or adapt quantity if he's already existing in LS
    if (productKeyInLocalStorage === null) {
        productsFromLocalStorage.push(productToAddInLocalStorage);
    } else {
        productsFromLocalStorage[productKeyInLocalStorage].quantity += productToAddInLocalStorage.quantity;
    }

    // Updating LS
    localStorage.setItem('products', JSON.stringify(productsFromLocalStorage));
}
// Search and compare display Product with product in local Storage
function findProductKeyInLocalStorage(productToAddInLocalStorage, products) {
    let productKeyFound = null;
    // for each product in ls, generate key to target it
    products.forEach(function (product, key) {
        if (product.id === productToAddInLocalStorage.id && product.color === productToAddInLocalStorage.color) {
            productKeyFound = key;
        }
    });
    return productKeyFound;
}