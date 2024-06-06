document.addEventListener('DOMContentLoaded', () => {
    fetchNewReleases();
    fetchGenres();
});

function fetchNewReleases() {
    fetch('http://localhost:3000/api/albums')
        .then(response => response.json())
        .then(albums => {
            const newReleases = document.getElementById('new-releases');
            newReleases.innerHTML = albums.map(album => `
                <div class="album">
                    <img src="uploads/${album.coverImage}" alt="${album.title}">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                </div>
            `).join('');
        });
}

function fetchGenres() {
    fetch('http://localhost:3000/api/genres')
        .then(response => response.json())
        .then(genres => {
            const genreList = document.getElementById('genre-list');
            genreList.innerHTML = genres.map(genre => `
                <li class="genre-item" onclick="filterByGenre('${genre.name}')">${genre.name}</li>
            `).join('');
        });
}

function filterByGenre(genre) {
    fetch(`http://localhost:3000/api/music?genre=${genre}`)
        .then(response => response.json())
        .then(music => {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = music.map(track => `
                <div class="album">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
            `).join('');
        });
}

function searchMusic() {
    const query = document.getElementById('search-input').value;
    fetch(`http://localhost:3000/api/music?search=${query}`)
        .then(response => response.json())
        .then(music => {
            const searchResults = document.getElementById('search-results');
            searchResults.innerHTML = music.map(track => `
                <div class="album">
                    <h3>${track.title}</h3>
                    <p>${track.artist}</p>
                </div>
            `).join('');
        });
}
