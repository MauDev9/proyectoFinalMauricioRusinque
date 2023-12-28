let carrito = [];
let cartCounter = 0;
const btnCar = document.getElementById("cartShopping");
const cartCounterElement = document.getElementById('cartCounter');
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

    cardBody.appendChild(title);
    cardBody.appendChild(img);
    cardBody.appendChild(price);
    cardBody.appendChild(description);
    cardBody.appendChild(stock);

    cardBody.appendChild(orderButton);

    card.appendChild(img);
    card.appendChild(cardBody);



    // Agregar al carrito.
    orderButton.addEventListener('click', () => {
        if (pizza.stock < 1) {
            Swal.fire({
                title: `Lo sentimos, no nos quedan más ${pizza.title}`,
                text: "",
                icon: "info",
            });
        } else {
            const swalButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                },
                buttonsStyling: false,
            });
    
            swalButtons
                .fire({
                    title: `¿Deseas agregar ${pizza.title} al carrito?`,
                    text: `¡solo quedan! ${pizza.stock}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Agregar",
                    cancelButtonText: "Cancelar",
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        // Se ejecuta solo si el usuario confirma agregar al carrito
                        pizza.stock--;
                        cartCounter++;
                        console.log(cartCounter)
                        console.log(pizza);
                        stock.innerText = `Stock: ${pizza.stock}`;
                        cartCounterElement.innerText = cartCounter
                        carrito.push(pizza)

                        Swal.fire({
                            title: `Su ${pizza.title} ha siddo agregada al carrito`,
                            text: "",
                            icon: "success",
                        });
                    }
                });
                
        }
    });


    return card;
}

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
        modal.classList.add("modalVisible", "d-flex", "justify-content-between", "align-items-center");
        modalVisible.textContent = "Hola";


    }
});

findAll().then((pizzas) => {
    pizzas.forEach(pizza => {
        const card = createPizzaCard(pizza);
        pizzaList.appendChild(card);
    });

});


