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
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

document.addEventListener("DOMContentLoaded", () => {
  displayDefaultSuperheroes();
});
function generateHash() {
  const ts = new Date().getTime();
  const hash = window.CryptoJS.MD5(`${ts}${privateKey}${publicKey}`).toString();
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}
function displayDefaultSuperheroes() {
  // const loadingIndicator = document.getElementById("loadingIndicator");
  const defaultHeroesList = document.getElementById("defaultHeroesList");

  // console.log("running ");

  // loadingIndicator.style.display = "block";

  defaultSuperheroes.forEach((heroName) => {
    const url = `${baseUrl}?name=${heroName}&${generateHash()}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const hero = data.data.results[0];

        const isFavorite = favorites.includes(hero.id.toString());

        const thumbnailUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
        // console.log(thumbnailUrl);
        const listItem = document.createElement("li");
        listItem.classList.add("default-hero-item");
        listItem.innerHTML = `
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
        defaultHeroesList.appendChild(listItem);
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
  console.log("clicked");
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
  loadingIndicator.style.display = "block";
  const url = `${baseUrl}?nameStartsWith=${name}&${generateHash()}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // console.log("data is", data);

      loadingIndicator.style.display = "none";
      ////
      // console.log("data is", data);

      const heroes = data.data.results;
      // console.log("heroes is", heroes);
      if (heroes.length > 0) {
        heroes.forEach((hero) => {
          const isFavorite = favorites.includes(hero.id.toString());
          const thumbnailUrl = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
          console.log(thumbnailUrl);
          const listItem = document.createElement("li");
          listItem.classList.add("default-hero-item");
          console.log("hero.urls", hero.urls);
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
        console.log("heroes is", heroes.length);

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
  ///
  //   resultList.innerHTML = "";
  //   const characters = data.data.results;
  //   if (characters.length > 0) {
  //     characters.forEach((character) => {
  //       const listItem = document.createElement("li");
  //       listItem.classList.add("list-group-item");
  //       listItem.innerHTML = `<a href="#" class="character-link" data-character-id="${character.id}">${character.name}</a>`;
  //       resultList.appendChild(listItem);
  //     });
  //   } else {
  //     const listItem = document.createElement("li");
  //     listItem.classList.add("list-group-item");
  //     listItem.innerText = "No results found.";
  //     resultList.appendChild(listItem);
  //   }
  // })
  // .catch((error) => console.error(error));
}

// function fetchComics(characterId) {
//   loadingIndicator.style.display = "block";
//   const url = `${comicsBaseUrl}${characterId}/comics?${generateHash()}`;
//   fetch(url)
//     .then((response) => response.json())
//     .then((comicsData) => {
//       const listItem = document.querySelector(
//         `a[data-character-id="${characterId}"]`
//       ).parentElement;
//       listItem.innerHTML = "";
//       if (comicsData.data.count > 0) {
//         const comics = comicsData.data.results;
//         listItem.innerHTML = createComicList(comics);
//       } else {
//         listItem.innerText = "No comics found for this character";
//       }
//     })
//     .catch((error) => console.error(error));
// }

// function createComicList(comics) {
//   loadingIndicator.style.display = "none";
//   let comicList = "";
//   comics.forEach((comic) => {
//     const title = comic.title;
//     const description = comic.description || "No description available.";
//     const truncatedDescription =
//       description.split(" ").slice(0, 20).join(" ") +
//       (description.split(" ").length > 20 ? "..." : "");

//     const thumbnailUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
//     const comicUrl = `http://marvel.com/comics/issue/${comic.id}/${comic.title}?utm_campaign=apiRef&utm_source=41318449c00ca45c69f14ba5bd6682af`; // Construct comic URL

//     comicList += `
//       <div class="card mb-3">
//         <img src="${thumbnailUrl}" class="card-img-top small-comic-image" alt="${title} ">
//         <div class="card-body">
//           <h5 class="card-title">${title}</h5>
//           <p class="card-text">${truncatedDescription}</p>
//           <a href="${comicUrl}" class="btn btn-primary">View Comic</a>
//         </div>
//       </div>
//     `;
//   });
//   return comicList;
// }

searchBar.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      searchHero(searchTerm);
    } else {
      alert("Pls enter a Superhero name");
    }
  }
});

searchButton.addEventListener("click", () => {
  const searchTerm = searchBar.value.trim();
  console.log(searchTerm);
  if (searchTerm) {
    searchHero(searchTerm);
  } else {
    alert("Pls enter a Superhero name");
  }
});

// resultList.addEventListener("click", (event) => {
//   if (event.target.classList.contains("character-link")) {
//     const characterId = event.target.dataset.characterId;
//     fetchComics(characterId);
//   }
// });
