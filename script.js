document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");

    searchButton.addEventListener("click", async function() {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Masukkan nama lagu untuk mencari!");
            return;
        }

        const apiURL = `https://iyaudah-iya.vercel.app/spotify/search?query=${encodeURIComponent(query)}`;

        try {
            resultsContainer.innerHTML = "<p>Mencari lagu...</p>";
            const response = await fetch(apiURL);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            if (data.length === 0) {
                resultsContainer.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
                return;
            }

            resultsContainer.innerHTML = "";
            data.forEach((track) => {
                const trackElement = document.createElement("div");
                trackElement.classList.add("track");
                trackElement.innerHTML = `
                    <img src="${track.image}" alt="${track.name}" />
                    <div>
                        <p><strong>${track.name}</strong> - ${track.artists}</p>
                        <p>Durasi: ${track.duration}</p>
                        <b><a href="${track.link}" target="_blank">Buka di Spotify</a></b>
                        <div class="buttons">
                            <button class="play-button" onclick="playSong('${track.link}')">
                                <i class="fas fa-play"></i> Play
                            </button>
                            <button class="download-button" onclick="downloadSong('${track.link}', this)">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                        <div id="spotify_player_${getSpotifyTrackId(track.link)}" style="margin-top:10px;"></div>
                    </div>
                `;
                resultsContainer.appendChild(trackElement);
            });
        } catch (error) {
            console.error("Error saat mencari lagu:", error);
            resultsContainer.innerHTML = "<p>Terjadi kesalahan saat mencari lagu.</p>";
        }
    });
});

async function downloadSong(songUrl) {
        if (!songUrl) {
                alert("URL lagu tidak ditemukan.");
                return;
        }
        
        const downloadApi = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(songUrl)}`;
        
        try {
                const response = await fetch(downloadApi);
                
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.status === true && data.download) {
                        window.location.href = data.download;
                } else {
                        alert("Download gagal, coba lagi nanti.");
                }
        } catch (error) {
                console.error("Error saat mengunduh lagu:", error);
                alert("Terjadi kesalahan saat mengunduh lagu.");
        }
}

function playSong(songUrl) {
    const trackId = getSpotifyTrackId(songUrl);
    const playerContainer = document.getElementById(`spotify_player_${trackId}`);

    if (!playerContainer) {
        console.error("Player container tidak ditemukan.");
        return;
    }

    document.querySelectorAll("[id^='spotify_player_']").forEach(el => el.innerHTML = "");

    playerContainer.innerHTML = `
        <iframe src="https://open.spotify.com/embed/track/${trackId}" 
            width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media">
        </iframe>
    `;
}

function getSpotifyTrackId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
}
