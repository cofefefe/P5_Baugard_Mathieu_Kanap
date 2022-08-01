fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then((data) => {
        function creationIntegrationElement(){
            data.forEach(element  => {
            console.log(element)
            // creation of all element of product card, add style to theses elements
            let a = document.createElement('a');
            let article = document.createElement('article');
            article.classList.add('productCard');
            let img = document.createElement('img');
            img.classList.add('productImage');
            let h3 = document.createElement('productName');
            h3.classList.add('productName');
            let p = document.createElement('p');
            p.classList.add('productDescription');
        
            // Integrate element in " items " section
            let items = document.getElementById('items')
            items.appendChild(a);
            a.appendChild(article);
            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
        
            // Integrate API's data on new element article //
        
            img.src      = element.imageUrl;
            h3.innerHTML = element.name;
            p.innerHTML  = element.description;
            a.href       = "product.html?id=" + element._id
        
            });
        }
        // function's calling to create all visual element
        creationIntegrationElement()
})