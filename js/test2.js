let carrito = [];
const btnCar = document.getElementById("cartShopping");
const pizzaList = document.getElementById("pizzaList");

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
                resolve(products);
            })
            .catch((error) => {
                console.error("Hubo un problema con la petición Fetch:", error);
                reject(error);
            });
    });
}

function createPizzaCard(pizza) {
    const card = document.createElement("div");
    card.classList.add("card", "border-primary", "mb-3", "d-flex", "flex-row");

    const img = document.createElement("img");
    img.src = pizza.img;
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



    // Agregar al carrito.
    orderButton.addEventListener('click', () => {
        if (pizza.stock < 1) {
            Swal.fire({
                title: "No hay stock disponible",
                icon: "error",
            });
            return;
        } else if (pizza.cantidad === 0) {
            Swal.fire({
                title: "Debes seleccionar al menos una pizza.   ",
                icon: "error",
            });
        } else {
            alert(`Se han agregado ${pizza.cantidad} ${pizza.title}`)
            carrito.push(pizza)
            pizza.stock--
            pizza.cantidad = (pizza.cantidad + 1);
            stock.textContent = `Stock: ${pizza.stock}`;

            console.log(carrito)
        }
    });

    // Aumentar
    increaseButton.addEventListener('click', () => {
        if (pizza.stock < 1) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `No tenemos mas stock de ${pizza.title}!`
            });
            console.log(carrito)
            return;
        }
        pizza.cantidad = (pizza.cantidad || 0) + 1;
        pizza.stock--
        quantitySpan.textContent = `${pizza.cantidad}`;
    });

    // Disminuir
    decreaseButton.addEventListener('click', () => {
        if (pizza.cantidad > 0) {
            pizza.cantidad--;
            pizza.stock++;
            quantitySpan.textContent = `${pizza.cantidad} `;

        }
    });

    return card;
}

findAll().then((pizzas) => {
    pizzas.forEach(pizza => {
        const card = createPizzaCard(pizza);
        pizzaList.appendChild(card);
    });

});


btnCar.addEventListener('click', () => {
    let pizzaJson = JSON.stringify(carrito);
    localStorage.setItem("Carrito", pizzaJson)
    if (carrito.length < 1) {
        Swal.fire({
            title: "El carrito está vacío.",
            text: "",
            icon: "error",
        });
    } else {
        const modal = document.createElement("modalVisble");
        modal.classList.add("modalVisible","d-flex", "justify-content-between", "align-items-center");
        modalVisible.textContent = "Hola";


    }
});
