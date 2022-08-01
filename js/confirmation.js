let site = document.location;
let link = new URL(site)
let orderId = link.searchParams.get("orderId");

// get place to display purchase order
let displayOrderId = document.getElementById('orderId')


//Display number purchase order
function displayOrderIdConfirmation(){
    displayOrderId.textContent = orderId
}
displayOrderIdConfirmation()