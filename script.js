const publicKey = "41318449c00ca45c69f14ba5bd6682af"; // Replace with your Marvel Public Key
const privateKey = "d969d7bbb74d3cffc50e7e924f89334a797fe296"; // Replace with your Marvel Private Key
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
const comicsBaseUrl = "https://gateway.marvel.com:443/v1/public/characters/";

const searchBar = document.getElementById("search-bar");
const resultList = document.getElementById("results");
const searchButton = document.getElementById("search-btn");
const loadingIndicator = document.getElementById("loadingIndicator");

function generateHash() {
  const ts = new Date().getTime();
  const hash = window.CryptoJS.MD5(`${ts}${privateKey}${publicKey}`).toString();
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

function searchHero(name) {
  loadingIndicator.style.display = "block";
  const url = `${baseUrl}?nameStartsWith=${name}&${generateHash()}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loadingIndicator.style.display = "none";
      resultList.innerHTML = "";
      const characters = data.data.results;
      if (characters.length > 0) {
        characters.forEach((character) => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.innerHTML = `<a href="#" class="character-link" data-character-id="${character.id}">${character.name}</a>`;
          resultList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerText = "No results found.";
        resultList.appendChild(listItem);
      }
    })
    .catch((error) => console.error(error));
}

function fetchComics(characterId) {
  loadingIndicator.style.display = "block";
  const url = `${comicsBaseUrl}${characterId}/comics?${generateHash()}`;
  fetch(url)
    .then((response) => response.json())
    .then((comicsData) => {
      const listItem = document.querySelector(
        `a[data-character-id="${characterId}"]`
      ).parentElement;
      listItem.innerHTML = "";
      if (comicsData.data.count > 0) {
        const comics = comicsData.data.results;
        listItem.innerHTML = createComicList(comics);
      } else {
        listItem.innerText = "No comics found for this character.";
      }
    })
    .catch((error) => console.error(error));
}

function createComicList(comics) {
  loadingIndicator.style.display = "none";
  let comicList = "";
  comics.forEach((comic) => {
    const title = comic.title;
    const description = comic.description || "No description available.";
    const truncatedDescription =
      description.split(" ").slice(0, 20).join(" ") +
      (description.split(" ").length > 20 ? "..." : "");

    const thumbnailUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
    const comicUrl = `http://marvel.com/comics/issue/${comic.id}/${comic.title}?utm_campaign=apiRef&utm_source=41318449c00ca45c69f14ba5bd6682af`; // Construct comic URL

    comicList += `
      <div class="card mb-3">
        <img src="${thumbnailUrl}" class="card-img-top small-comic-image" alt="${title} ">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${truncatedDescription}</p>
          <a href="${comicUrl}" class="btn btn-primary">View Comic</a>
        </div>
      </div>
    `;
  });
  return comicList;
}

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

searchButton.addEventListener("click", (event) => {
  const searchTerm = searchBar.value.trim();
  console.log(searchTerm);
  if (searchTerm) {
    searchHero(searchTerm);
  } else {
    alert("Pls enter a Superhero name");
  }
});

resultList.addEventListener("click", (event) => {
  if (event.target.classList.contains("character-link")) {
    const characterId = event.target.dataset.characterId;
    fetchComics(characterId);
  }
});
