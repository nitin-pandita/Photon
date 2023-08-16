const auth = "wow5K0BWewDJiJUpwDZsWBhCUXjB814bmBL2WVSlnCz8J0KjB8b9ZCTk";
const gallery = document.querySelector(".gallery");
const form = document.querySelector(".search-form");
const submit = document.querySelector(".submit-btn");
const searchInput = document.querySelector(".search-input");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let itemsPerPage = 10;
let fetchLink;
// now i need to see if there anything inside the text or not if yes pass it
let currentSearch;
// functions
function updateInput(e) {
  searchValue = e.target.value;
}

// adding event Listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value.trim() !== "") {
    currentSearch = searchValue;
    searchPhotos(searchValue);
  } else {
    alert('You must enter a valid entry to search.')
  }
});

more.addEventListener("click", loadMore);
// using the await method

// ? root - api fetching function
async function fetchApi(url) {
  const fetchData = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: auth,
      Accept: "application/json",
    },
  });
  const data = await fetchData.json();
  return data;
}
// getting the photos
async function generateImages(data) {
  data.photos.forEach((photo) => {
    const galleryImage = document.createElement("div");
    galleryImage.classList.add("gallery-img");
    galleryImage.innerHTML = `
    <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
    </div>
    <img src=${photo.src.large}></img>
    `;
    gallery.appendChild(galleryImage);
  });
}

async function curatedPhoto() {
  fetchLink = `https://api.pexels.com/v1/curated?per_page=${itemsPerPage}&page=1`;
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

// duplicate of generateImages but for videos
async function generateVideos(data) {
  data.videos.forEach(video => {
    const galleryVideo = document.createElement("div");
    galleryVideo.classList.add("gallery-img");
    galleryVideo.innerHTML = `
    <div class="gallery-info">
        <p>${video.user.name}</p>
        <a href=${video.video_files[0].link}>Download</a>
    </div>
    <video controls>
      <source src=${video.video_files[1].link} type='video/mp4' />
    </video>
    `;
    gallery.appendChild(galleryVideo);
  });
}

// duplicate function to fetch and gather video api data
async function popularVideos() {
  fetchLink = `https://api.pexels.com/videos/popular?per_page=${itemsPerPage}&page=1`;
  const data = await fetchApi(fetchLink);
  generateVideos(data)
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=${itemsPerPage}&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=${itemsPerPage}&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

// clearing the previous data or images
function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

function gatherPhotosAndVideos() {
  curatedPhoto()
  popularVideos()  
}

gatherPhotosAndVideos()