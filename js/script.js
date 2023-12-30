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
    card.classList.add("card", "border-primary", "mb-3", "d-flex", "flex-row", "col-md-4");

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

            // Verifica si la cantidad a agregar es menor o igual al stock
            const cantidadAgregada = 1;

            if (cantidadAgregada <= pizza.stock) {
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
                            const existingPizza = carrito.find((p) => p.title === pizza.title);

                            if (existingPizza) {
                                if (existingPizza.cantidad + cantidadAgregada <= 3) {
                                    existingPizza.cantidad += cantidadAgregada;
                                } else {
                                    Swal.fire({
                                        title: `No puedes agregar más de 3 ${pizza.title}`,
                                        text: "",
                                        icon: "info",
                                    });
                                    return;
                                }
                            } else {
                                const pizzaToAdd = { ...pizza, cantidad: cantidadAgregada };
                                carrito.push(pizzaToAdd);
                            }

                            pizza.stock -= cantidadAgregada;
                            cartCounter += cantidadAgregada;

                            Swal.fire({
                                title: `Su ${pizza.title} ha sido agregada al carrito`,
                                text: "",
                                icon: "success",
                            });

                            stock.innerText = `Stock: ${pizza.stock}`;
                            cartCounterElement.innerText = cartCounter;
                        }
                    });
            } else {
                Swal.fire({
                    title: `No hay suficiente stock de ${pizza.title}`,
                    text: "",
                    icon: "info",
                });
            }
        }
    });

    return card;
}

btnCar.addEventListener('click', () => {
    cartPizzas()
});

function cartPizzas() {
    let pizzaJson = JSON.stringify(carrito);
    localStorage.setItem("Carrito", pizzaJson)
    if (carrito.length < 1) {
        Swal.fire({
            title: "El carrito está vacío.",
            text: "",
            icon: "error",
        });
    } else {
        btnCar.style.display = 'none'
        pizzaList.style.display = 'none';

        const modal = document.createElement("div");
        modal.classList.add("modal", "d-flex", "flex-column", "justify-content-between", "align-items-center", "mb-3");

        const modalTitle = document.createElement("h2");
        modalTitle.textContent = `Continua comprando.`;

        modal.appendChild(modalTitle);

        let totalCompra = 0;

        const modalCardsContainer = document.createElement("div");
        modalCardsContainer.classList.add("modal-cards-container", "row");

        carrito.forEach((pizza) => {
            const pizzaInfo = document.createElement("div");
            pizzaInfo.classList.add("pizza-info", "col-md-4");

            const pizzaTitle = document.createElement("h3");
            pizzaTitle.textContent = pizza.title;

            const pizzaCantidad = document.createElement("p");
            pizzaCantidad.textContent = `Cantidad: ${pizza.cantidad}`;

            const pizzaPrice = document.createElement("p");
            let subtotal = pizza.price * pizza.cantidad;
            pizzaPrice.textContent = `Subtotal: $${subtotal}`;
            totalCompra += subtotal;

            const increaseButton = document.createElement("button");
            increaseButton.classList.add("btn", "btn-outline-success", "button-aumentar",);
            increaseButton.textContent = "+";
            increaseButton.addEventListener('click', () => {
                if (pizza.cantidad < 3) {
                    pizza.cantidad += 1;
                    pizzaCantidad.textContent = `Cantidad: ${pizza.cantidad}`;
                    subtotal = pizza.price * pizza.cantidad;
                    pizzaPrice.textContent = `Subtotal: $${subtotal}`;
                    totalCompra += pizza.price;
                } else {
                    Swal.fire({
                        title: `No puedes agregar más de 3 ${pizza.title}`,
                        text: "",
                        icon: "info",
                    });
                }
            });

            const decreaseButton = document.createElement("button");
            decreaseButton.classList.add("btn", "btn-outline-danger", "button-disminuir");
            decreaseButton.textContent = "-";

            decreaseButton.addEventListener('click', () => {
                if (pizza.cantidad > 1) {
                    pizza.cantidad -= 1;
                    pizzaCantidad.textContent = `Cantidad: ${pizza.cantidad}`;
                    subtotal = pizza.price * pizza.cantidad;
                    pizzaPrice.textContent = `Subtotal: $${subtotal}`;
                    totalCompra -= pizza.price;
                } else {
                    Swal.fire({
                        title: `¿Deseas eliminar ${pizza.title} del carrito?`,
                        text: "",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const pizzaIndex = carrito.findIndex((p) => p.title === pizza.title);
                            if (pizzaIndex !== -1) {
                                carrito.splice(pizzaIndex, 1);
                            }

                            pizzaInfo.remove();

                            if (carrito.length === 0) {
                                Swal.fire({
                                    title: `Serás redirigido/a a la pagina principal.`,
                                    text: "Vuelve pronto.",
                                    icon: "warning",
                                });
                                setTimeout(() => {
                                    carrito = [];
                                    localStorage.removeItem("Carrito");
                                    location.reload(true);
                                }, 2000);
                            }
                        }
                    });
                }
            });

            pizzaInfo.appendChild(pizzaTitle);
            pizzaInfo.appendChild(pizzaCantidad);
            pizzaInfo.appendChild(pizzaPrice);

            pizzaInfo.appendChild(increaseButton);
            pizzaInfo.appendChild(decreaseButton);

            modalCardsContainer.appendChild(pizzaInfo);
        });

        const clearCartButton = document.createElement("button");
        clearCartButton.classList.add("btn", "btn-danger", "mt-3", "mx-auto");
        clearCartButton.textContent = "Limpiar Carrito";
        clearCartButton.addEventListener("click", () => {
            Swal.fire({
                title: `Seras redirigido/a a la pagina principal.`,
                text: "",
                icon: "warning",
            });
            setTimeout(() => {
                carrito = [];
                localStorage.removeItem("Carrito");
                location.reload(true);
            }, 2000);
        });

        const checkoutButton = document.createElement("button");
        checkoutButton.classList.add("btn", "btn-success", "mt-3", "mx-auto");
        checkoutButton.textContent = "Finalizar Compra";
        checkoutButton.addEventListener('click', () => {
            Swal.fire({
                title: "Resumen de la compra",
                html: resumenCompra(totalCompra),
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "¡Gracias por tu compra!",
                        text: "Tu orden está en camino. ¡Buen provecho!",
                        icon: "success",
                    }).then(() => {
                        carrito = [];
                        localStorage.removeItem("Carrito");
                        location.reload(true);
                    });
                }
            });
        });

        modal.appendChild(modalCardsContainer);
        modal.appendChild(clearCartButton);
        modal.appendChild(checkoutButton);

        document.body.appendChild(modal);
    }
}

function resumenCompra(totalCompra) {
    let resumen = "<div>";
    carrito.forEach((pizza) => {
        resumen += `<p>${pizza.title} x${pizza.cantidad}</p>`;
    });
    resumen += `<p>Total: $${totalCompra}</p></div>`;
    return resumen;
}

findAll().then((pizzas) => {
    pizzas.forEach(pizza => {
        const card = createPizzaCard(pizza);
        pizzaList.appendChild(card);
    });
});