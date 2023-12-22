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
        const sectionList = document.getElementById("pizzaList");
        const article = document.createElement("article");
        article.classList.add("pizzaCard");
        const h2 = document.createElement("h2");
        const img = document.createElement("img");
        const h3 = document.createElement("h3");
        const h4 = document.createElement("h4");
        const button = document.createElement("button");
        const buttonPlus = document.createElement("button");
        const buttonLess = document.createElement("button");

        button.classList.add("add-cart");
        h2.textContent = pizza.title;
        h3.textContent = `$${pizza.price}`;
        h4.textContent = `${pizza.cantidad || 0}`;
        button.textContent = "Agregar";
        buttonPlus.textContent = "+";
        buttonLess.textContent = "-";
        img.src = pizza.img;
        img.style.width = "350px";

        article.appendChild(h2);
        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(h4);
        article.appendChild(button);
        article.appendChild(buttonPlus);
        article.appendChild(buttonLess);

        button.name = pizza.title;
        button.value = pizza.id;

        sectionList.appendChild(article)

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
            h4.textContent = `${pizza.cantidad || 0}`;
        });

        //dismonuir
        buttonLess.addEventListener('click', () =>{
            if (pizza.cantidad > 0) {
                pizza.cantidad--;
                pizza.stock++;
                h4.textContent = `${pizza.cantidad || 0}`; 
                console.log(pizza.cantidad);
            }
        });
    });
});
