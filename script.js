document.addEventListener("DOMContentLoaded", () => {
    // 1. Lista de Usuarios
    fetchUsers();
    document.getElementById("searchUser").addEventListener("input", filterUsers);

    // 2. Noticias (Simuladas)
    document.getElementById("getNews").addEventListener("click", fetchNews);

    // 3. Clima (Simulado)
    document.getElementById("getWeather").addEventListener("click", fetchWeather);

    // 4. Conversor de Monedas (Simulado)
    document.getElementById("convertCurrency").addEventListener("click", convertCurrency);

    // 5. Galería de Imágenes (Simulada)
    document.getElementById("getImages").addEventListener("click", fetchImages);

    // 6. Pokédex
    document.getElementById("getPokemon").addEventListener("click", fetchPokemon);

    // 7. Películas (Simuladas)
    document.getElementById("getMovies").addEventListener("click", fetchMovies);

    // 8. Criptomonedas
    document.getElementById("getCrypto").addEventListener("click", fetchCrypto);

    // 9. Tareas
    document.getElementById("addTask").addEventListener("click", addTask);
    loadTasks();

    // 10. Países
    document.getElementById("getCountry").addEventListener("click", fetchCountry);
});


async function fetchUsers() {
    try {
        const response = await fetch("https://randomuser.me/api/?results=10");
        const data = await response.json();
        displayUsers(data.results);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
    }
}

function displayUsers(users) {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${user.picture.thumbnail}" alt="Foto"></td>
            <td>${user.name.first} ${user.name.last}</td>
            <td>${user.email}</td>
        `;
        userList.appendChild(row);
    });
}

function filterUsers() {
    const search = document.getElementById("searchUser").value.toLowerCase();
    document.querySelectorAll("#userList tr").forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(search) ? "" : "none";
    });
}


function fetchNews() {
    const query = document.getElementById("searchNews").value.toLowerCase();
    const fakeNews = [
        { title: "Nueva IA revoluciona la tecnología", description: "Un avance en la inteligencia artificial..." },
        { title: "Lanzamiento del iPhone 15", description: "Apple presenta su nuevo modelo..." },
        { title: "Coches eléctricos dominan el mercado", description: "Las ventas se disparan un 50%..." }
    ];

    const filtered = fakeNews.filter(n => n.title.toLowerCase().includes(query));
    const newsList = document.getElementById("newsList");
    newsList.innerHTML = filtered.length ? filtered.map(article => `
        <div>
            <h4>${article.title}</h4>
            <p>${article.description}</p>
        </div>
    `).join("") : "<p>No se encontraron noticias.</p>";
}


function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    const fakeWeather = {
        "Madrid": { temp: 25, description: "Soleado" },
        "Londres": { temp: 18, description: "Nublado" },
        "Nueva York": { temp: 22, description: "Parcialmente nublado" }
    };

    const weather = fakeWeather[city] || { temp: "--", description: "Ciudad no encontrada" };
    document.getElementById("weatherResult").innerHTML = `
        <h3>${city}</h3>
        <p>Temperatura: ${weather.temp}°C</p>
        <p>Clima: ${weather.description}</p>
    `;
    localStorage.setItem("lastCity", city);
}


document.getElementById("convertCurrency").addEventListener("click", function () {
    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("fromCurrency").value.trim().toUpperCase();
    const to = document.getElementById("toCurrency").value.trim().toUpperCase();
    const resultText = document.getElementById("currencyResult");

   
    const fakeRates = {
        "USD": { "EUR": 0.9, "GBP": 0.8, "USD": 1 },
        "EUR": { "USD": 1.1, "GBP": 0.88, "EUR": 1 },
        "GBP": { "USD": 1.25, "EUR": 1.14, "GBP": 1 }
    };

    
    if (!amount || amount <= 0) {
        resultText.innerText = "⚠ Ingrese una cantidad válida.";
        return;
    }
    if (!fakeRates[from]) {
        resultText.innerText = `⚠ Moneda no válida: ${from}`;
        return;
    }
    if (!fakeRates[to]) {
        resultText.innerText = `⚠ Moneda no válida: ${to}`;
        return;
    }

   
    const rate = fakeRates[from][to];
    const result = amount * rate;

    
    resultText.innerHTML = `<strong>${amount} ${from} = ${result.toFixed(2)} ${to}</strong>`;
});


const BASE_API_URL = "https://api.api-ninjas.com/v1/randomimage";
const API_KEY = "TU_CLAVE_DE_API"; 
const IMAGE_PLACEHOLDER = "https://via.placeholder.com/150";


function fetchImages() {
    const query = document.getElementById("searchImage").value.trim();
    const gallery = document.getElementById("imageGallery");

    
    if (!query) {
        alert("⚠ Ingresa un término de búsqueda.");
        return;
    }

    
    gallery.innerHTML = "";

    
    loadImages(query, gallery, 5);

    
    const loadMoreButton = createLoadMoreButton(query, gallery);
    gallery.appendChild(loadMoreButton);
}


function createLoadMoreButton(query, gallery) {
    const button = document.createElement("button");
    button.textContent = "Ver más";
    button.classList.add("load-more-btn");
    button.addEventListener("click", () => loadImages(query, gallery, 5));
    return button;
}


async function loadImages(query, gallery, count) {
    const currentImages = gallery.querySelectorAll(".image-container").length;

    for (let i = currentImages + 1; i <= currentImages + count; i++) {
        try {
            const imgContainer = createImageContainer();
            gallery.insertBefore(imgContainer, gallery.lastElementChild); 

            
            await loadImageFromAPI(query, imgContainer);
        } catch (error) {
            console.error("Error al cargar la imagen:", error);
            alert("Ocurrió un error al cargar las imágenes. Inténtalo de nuevo.");
        }
    }
}


function createImageContainer() {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = IMAGE_PLACEHOLDER; 
    img.alt = "Imagen cargando...";
    img.classList.add("gallery-image");
    img.style.opacity = "0"; 

    imgContainer.appendChild(img);
    setupLazyLoading(imgContainer);

    return imgContainer;
}


async function loadImageFromAPI(query, imgContainer) {
    const img = imgContainer.querySelector("img");

    try {
        const response = await fetch(`${BASE_API_URL}?category=${query}`, {
            headers: { "X-Api-Key": API_KEY },
        });

        console.log(response); 

        if (!response.ok) {
            throw new Error("Error al cargar la imagen.");
        }

        const blob = await response.blob();
        img.src = URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error al cargar la imagen:", error);
        img.src = IMAGE_PLACEHOLDER; 
    }

    
    img.addEventListener("load", () => {
        img.style.opacity = "1";
    });
}


function setupLazyLoading(imgContainer) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(imgContainer);
}


async function fetchPokemon() {
    const pokemon = document.getElementById("searchPokemon").value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!response.ok) return alert("Pokémon no encontrado");
    const data = await response.json();
    document.getElementById("pokemonResult").innerHTML = `
        <h3>${data.name.toUpperCase()}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Altura: ${data.height}</p>
        <p>Peso: ${data.weight}</p>
        <p>Habilidades: ${data.abilities.map(a => a.ability.name).join(", ")}</p>
    `;
}


function fetchMovies() {
    const title = document.getElementById("searchMovie").value.toLowerCase();
    const fakeMovies = [
        { title: "Inception", year: "2010", poster: "https://via.placeholder.com/100?text=Inception" },
        { title: "Titanic", year: "1997", poster: "https://via.placeholder.com/100?text=Titanic" },
        { title: "Avatar", year: "2009", poster: "https://via.placeholder.com/100?text=Avatar" }
    ];

    const filtered = fakeMovies.filter(m => m.title.toLowerCase().includes(title));
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = filtered.length ? filtered.map(movie => `
        <div>
            <h4>${movie.title} (${movie.year})</h4>
            <img src="${movie.poster}" alt="${movie.title}">
        </div>
    `).join("") : "<p>No se encontraron películas.</p>";
}


async function fetchCrypto() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
    const data = await response.json();

    document.getElementById("cryptoPrices").innerHTML = `
        <p>Bitcoin: $${data.bitcoin.usd}</p>
        <p>Ethereum: $${data.ethereum.usd}</p>
        <canvas id="cryptoChart"></canvas>
    `;

    renderChart(data);
}

function renderChart(data) {
    const ctx = document.getElementById("cryptoChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bitcoin", "Ethereum"],
            datasets: [{
                label: "Precio en USD",
                data: [data.bitcoin.usd, data.ethereum.usd],
                backgroundColor: ["#f7931a", "#627eea"],
                borderColor: ["#c76c0c", "#4b5dab"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function addTask() {
    const taskInput = document.getElementById("newTask");
    const task = taskInput.value.trim();
    if (!task) return alert("⚠ Agrega una tarea");

    const taskList = document.getElementById("taskList");
    const li = createTaskElement(task);
    taskList.appendChild(li);

    saveTasks();
    taskInput.value = "";
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(deleteBtn);
    return li;
}

function saveTasks() {
    const tasks = [...document.querySelectorAll("#taskList li")]
        .map(li => li.firstChild.textContent);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    tasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
}


async function fetchCountry() {
    const country = document.getElementById("searchCountry").value;
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!response.ok) return alert("País no encontrado");
    const data = await response.json();
    const countryData = data[0];
    document.getElementById("countryResult").innerHTML = `
        <h3>${countryData.name.common}</h3>
        <p>Capital: ${countryData.capital}</p>
        <p>Población: ${countryData.population.toLocaleString()}</p>
        <p>Continente: ${countryData.region}</p>
        <img src="${countryData.flags.svg}" alt="Bandera">
    `;
}
