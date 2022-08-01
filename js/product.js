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

    // add product to the local storage with their new params
    addProductInLocalStorage(productToAddInLocalStorage);

    // Redirect to the cart page after adding an item to ls
    document.location.href = "cart.html";
})
}
addProductParam()