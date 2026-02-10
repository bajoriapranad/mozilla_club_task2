const API_KEY = "7e9091a5";

const movieGrid = document.getElementById("movieGrid");
const statusText = document.getElementById("status");
const searchBtn = document.getElementById("searchBtn");

/* -------- Button Click -------- */
searchBtn.addEventListener("click", searchMovies);

/* -------- Search Function -------- */
async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const minRating = document.getElementById("ratingFilter").value;

  if (!query) {
    showStatus("Please enter a movie name.");
    return;
  }

  showStatus("Loading...");
  movieGrid.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      showStatus(data.Error);
      return;
    }

    displayMovies(data.Search, minRating);

  } catch (error) {
    showStatus("Network error. Check internet.");
  }
}

/* -------- Display Movies -------- */
async function displayMovies(movies, minRating) {
  movieGrid.innerHTML = "";
  let found = false;

  for (const movie of movies) {

    const detailsRes = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
    );

    const details = await detailsRes.json();
    const rating = parseFloat(details.imdbRating);

    if (minRating && rating < minRating) continue;

    found = true;

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/300"}">
      <div class="movie-info">
        <h3>${details.Title}</h3>
        <p>Year: ${details.Year}</p>
        <p>⭐ IMDB: ${details.imdbRating}</p>
      </div>
    `;

    movieGrid.appendChild(card);
  }

  if (!found) {
    showStatus("No movies match your filter.");
  } else {
    statusText.textContent = "";
  }
}

/* -------- Status Message -------- */
function showStatus(message) {
  statusText.textContent = message;
}
