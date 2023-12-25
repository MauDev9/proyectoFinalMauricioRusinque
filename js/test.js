//agregar al carrito

let carrito = [];
//let cantidad = 0;
const btnCar = document.getElementById("cartShopping");
const listSection = document.getElementById("pizzaList")



async function findAll() {
    return new Promise((resolve, reject) => {
        fetch("../JSON/pizzas.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then((products) => {
                console.log(products)
                resolve(products); // Resuelve la promesa con los datos obtenidos
            })
            .catch((error) => {
                console.error("Hubo un problema con la petición Fetch:", error);
                reject(error); // Rechaza la promesa con el error
            });
    });
};



btnCar.addEventListener('click', () => {
    let pizzaJson = JSON.stringify(carrito);
    localStorage.setItem("Carrito", pizzaJson)
    if (carrito.length < 1) {
        Swal.fire({
            title: "El carrito está vacio.",
            text: "",
            icon: "error",
        });
    } else {

    }

})


findAll().then((pizzas) => {
    pizzas.forEach(pizza => {
        const card = document.createElement("div");
        card.classList.add("card", "border-primary", "mb-3");
    
        const img = document.createElement("img");
        img.src = pizza.image;
        img.alt = pizza.title;
        img.classList.add("card-img-top");
    
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
    
        const title = document.createElement("h2");
        title.classList.add("card-title");
        title.textContent = pizza.title;
    
        const price = document.createElement("h3");
        price.classList.add("card-text");
        price.textContent = `$${pizza.price}`;
        
        const stock = document.createElement("h4");
        stock.classList.add("card-text");
        stock.textContent = `Stock: ${pizza.stock}`;
    
        const description = document.createElement("p");
        description.classList.add("card-text");
        description.textContent = pizza.description;
    
        const orderButton = document.createElement("button");
        orderButton.classList.add("btn", "btn-primary", "button-agg-carrito");
        orderButton.textContent = "Ordenar";
    
        const quantityContainer = document.createElement("div");
        quantityContainer.classList.add("d-flex", "justify-content-between", "align-items-center");
    
        const increaseButton = document.createElement("button");
        increaseButton.classList.add("btn", "btn-outline-success", "button-aumentar");
        increaseButton.textContent = "+";
    
        const quantitySpan = document.createElement("span");
        quantitySpan.classList.add("cantidad", "badge", "bg-secondary");
        quantitySpan.textContent = "0";
    
        const decreaseButton = document.createElement("button");
        decreaseButton.classList.add("btn", "btn-outline-danger", "button-disminuir");
        decreaseButton.textContent = "-";
    
        quantityContainer.appendChild(increaseButton);
        quantityContainer.appendChild(quantitySpan);
        quantityContainer.appendChild(decreaseButton);
    
        cardBody.appendChild(title);
        cardBody.appendChild(img);
        cardBody.appendChild(price);
        cardBody.appendChild(description);
        cardBody.appendChild(stock);
        cardBody.appendChild(orderButton);
        cardBody.appendChild(quantityContainer);
    
        card.appendChild(img);
        card.appendChild(cardBody);
    
        return card;

        // Agregar al carrito.
        button.addEventListener('click', () => {
            if (pizza.stock < 1) {
                alert(`Se acabó la pizza.`)
                return;
            }else if (pizza.cantidad === 0){
                alert(`Debes seleccionar al menos una pizza.`)
            }else{
                alert(`Se han agregado ${pizza.cantidad} ${button.name}`)
            carrito.push(pizza)
            pizza.stock--
            pizza.cantidad = (pizza.cantidad) + 1;
            console.log(carrito)
            }
            
        });

        //Aumentar
        buttonPlus.addEventListener('click', () => {

            if (pizza.stock < 1) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `No hay tenemos mas stock de ${button.name}!`
                });
                return;
            }
            pizza.cantidad = (pizza.cantidad || 0) + 1;
            pizza.stock--
            h4.textContent = `${pizza.cantidad}`;
        });

        //dismonuir
        buttonLess.addEventListener('click', () =>{
            if (pizza.cantidad > 0) {
                pizza.cantidad--;
                pizza.stock++;
                h4.textContent = `${pizza.cantidad}`; 
                console.log(pizza.cantidad);
            }
        });

    });
});
