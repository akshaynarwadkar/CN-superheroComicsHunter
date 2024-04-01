const publicKey = "41318449c00ca45c69f14ba5bd6682af"; // Replace with your Marvel Public Key
const privateKey = "d969d7bbb74d3cffc50e7e924f89334a797fe296"; // Replace with your Marvel Private Key
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
const comicsBaseUrl = "https://gateway.marvel.com:443/v1/public/characters/";

const searchBar = document.getElementById("search-bar");
const resultList = document.getElementById("results");
const searchButton = document.getElementById("search-btn");
const loadingIndicator = document.getElementById("loadingIndicator");
const defaultSuperheroes = [
  "Spider-Man (Peter Parker)",
  "Magneto",
  "Professor X",
  "iron man",
  "hulk",
  "black widow",
  "daredevil",
  "wolverine",
  "deadpool",
  "Storm",
];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;
  if (hash === "#favorites") {
    showFavorites();
  } else {
    displayDefaultSuperheroes();
  }
  // displayDefaultSuperheroes();
});
function generateHash() {
  const ts = new Date().getTime();
  const hash = window.CryptoJS.MD5(`${ts}${privateKey}${publicKey}`).toString();
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}
function displayDefaultSuperheroes() {
  const defaultHeroesList = document.getElementById("defaultHeroesList");
  const recSuperheroes = document.getElementById("recSuperheroes");
  defaultHeroesList.innerHTML = "<h2>kajsdn</h2>";
  resultList.innerHTML = "";
  window.location.hash = "";

  defaultSuperheroes.forEach((heroName) => {
    const url = `${baseUrl}?name=${heroName}&${generateHash()}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const hero = data.data.results[0];
        favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorite = favorites.includes(hero.id.toString());

        const thumbnailUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;

        const listItem = document.createElement("li");
        listItem.classList.add("default-hero-item");
        listItem.innerHTML = `<br/>
          <div class="hero-item">
          
          <div>
              <a href="${hero.urls[2].url}" target="_blank">
                <img src="${thumbnailUrl}" alt="${
          hero.name
        }" width="150" height="150" class="default-hero-image">
            </a>
             </div>
            <div class="hero-details">
              <h3>${
                hero.name === "Spider-Man (Peter Parker)"
                  ? "Spider-Man"
                  : hero.name
              }</h3>
              <button class="favorite-btn ${
                isFavorite ? "favorite" : ""
              }" data-id="${hero.id}">
                ${isFavorite ? "&#9733;" : "&#9734;"}
              </button>
            </div>
          </div>
        `;
        const favBtn = listItem.querySelector(".favorite-btn");
        favBtn.addEventListener("click", handleFavoriteClick);
        recSuperheroes.appendChild(listItem);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        // loadingIndicator.style.display = "none";
      });
  });
  // const favoriteBtns = document.querySelectorAll(".favorite-btn");
  // favoriteBtns.forEach((btn) => {
  //   btn.addEventListener("click", handleFavoriteClick);
  // });
}
function handleFavoriteClick(event) {
  const btn = event.currentTarget;
  const heroId = btn.dataset.id;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.includes(heroId)) {
    favorites = favorites.filter((id) => id !== heroId);
    btn.classList.remove("favorite");
    btn.innerHTML = "&#9734;";
  } else {
    favorites.push(heroId);
    btn.classList.add("favorite");
    btn.innerHTML = "&#9733;";
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function searchHero(name) {
  const defaultHeroesList = document.getElementById("defaultHeroesList");
  defaultHeroesList.innerHTML = "";
  resultList.innerHTML = "";
  loadingIndicator.style.display = "block";
  const url = `${baseUrl}?nameStartsWith=${name}&${generateHash()}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loadingIndicator.style.display = "none";

      const heroes = data.data.results;

      if (heroes.length > 0) {
        heroes.forEach((hero) => {
          const isFavorite = favorites.includes(hero.id.toString());
          const thumbnailUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;

          const listItem = document.createElement("li");
          listItem.classList.add("default-hero-item");

          listItem.innerHTML = `
                <div class="hero-item">
                <div>
                    <a href="${hero.urls[1].url}" target="_blank">
                      <img src="${thumbnailUrl}" alt="${
            hero.name
          }" width="150" height="150" class="default-hero-image">
                  </a>
                  </div>
                  <div class="hero-details">
                    <h3>${
                      hero.name === "Spider-Man (Peter Parker)"
                        ? "Spider-Man"
                        : hero.name
                    }</h3>
                    <button class="favorite-btn ${
                      isFavorite ? "favorite" : ""
                    }" data-id="${hero.id}">
                      ${isFavorite ? "&#9733;" : "&#9734;"}
                    </button>
                  </div>
                </div>
              `;
          const favBtn = listItem.querySelector(".favorite-btn");
          favBtn.addEventListener("click", handleFavoriteClick);
          defaultHeroesList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerHTML =
          "Oops! It seems like you've entered the DC Universe by mistake 😈 <br> <span style='color: blue;'>Please search for a Marvel superhero to experience true heroic greatness!😎</span>";
        resultList.appendChild(listItem);
      }
    })
    .catch((error) => console.error(error))
    .finally(() => {
      loadingIndicator.style.display = "none";
    });
}

function showFavorites() {
  window.location.hash = "favorites";
  const defaultHeroesList = document.getElementById("defaultHeroesList");
  defaultHeroesList.innerHTML = "";
  window.location.hash = "favorites";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    const listItem = document.createElement("li");
    listItem.classList.add("default-hero-item");
    listItem.textContent = "No favorite superheroes found.";
    defaultHeroesList.appendChild(listItem);
    return;
  }

  favorites.forEach((heroId) => {
    const url = `${baseUrl}/${heroId}?${generateHash()}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const hero = data.data.results[0];
        const thumbnailUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        const listItem = document.createElement("li");
        listItem.classList.add("default-hero-item");
        listItem.innerHTML = `
          <div class="hero-item">
            <div>
              <a href="${hero.urls[1].url}" target="_blank">
                <img src="${thumbnailUrl}" alt="${
          hero.name
        }" width="150" height="150" class="default-hero-image">
              </a>
            </div>
            <div class="hero-details">
              <h3>${
                hero.name === "Spider-Man (Peter Parker)"
                  ? "Spider-Man"
                  : hero.name
              }</h3>
              <button class="remove-favorite-btn" data-id="${
                hero.id
              }">Remove from Favorites</button>
            </div>
          </div>
        `;
        const removeFavoriteBtn = listItem.querySelector(
          ".remove-favorite-btn"
        );

        if (removeFavoriteBtn) {
          removeFavoriteBtn.addEventListener("click", handleRemoveFavorite);
        }
        defaultHeroesList.appendChild(listItem);
      })
      .catch((error) => console.error(error));
  });
}

function handleRemoveFavorite(event) {
  const btn = event.currentTarget;
  const heroId = btn.dataset.id;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter((id) => id !== heroId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  showFavorites();
}

searchBar.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = event.target.value.trim();
    event.target.value = "";
    if (searchTerm) {
      searchHero(searchTerm);
    } else {
      alert("Pls enter a Superhero name");
    }
  }
});

searchButton.addEventListener("click", () => {
  const searchTerm = searchBar.value.trim();
  searchBar.value = "";

  if (searchTerm) {
    searchHero(searchTerm);
  } else {
    alert("Pls enter a Superhero name");
  }
});

const showFavoritesBtn = document.getElementById("showFavoritesBtn");
showFavoritesBtn.addEventListener("click", showFavorites);

const titleElement = document.getElementById("title");
titleElement.addEventListener("click", displayDefaultSuperheroes);
