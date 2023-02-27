const SERVER_URL = 'http://localhost:5555/api/weather';
const favorites = JSON.parse(localStorage.getItem('favorites') || "[]");
const form = document.querySelector('form');
const card = document.querySelector('.card');
const favoritesPanel = document.querySelector('#favorites');

const fetchWeatherData = async (location) =>
    fetch(`${SERVER_URL}?location=${location}`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));

const addEventListenersToHeaders = () => {
    const cardHeaders = document.querySelectorAll('.card-header');

    cardHeaders.forEach(cardHeader => {
        cardHeader.addEventListener('click', e => {
            const content = cardHeader.nextElementSibling;
            content.classList.contains('show')
                ? content.classList.remove('show')
                : content.classList.add('show');
            cardHeaders.forEach(h => {
                if (h !== cardHeader) {
                    h.nextElementSibling.classList.remove('show')
                }
            });
        });
    });
};

const renderFavorites = () => {
    if (favorites.length) {
        favoritesPanel.classList.remove('d-none');
        favorites.forEach(favorite => {
            fetchWeatherData(favorite)
                .then(data => {
                    favoritesPanel.innerHTML += createFavorite(data);
                    addEventListenersToHeaders();
                })
                .catch(err => console.log(err));
        });
    }
};

renderFavorites();

const updateElementByClass = (className, innerHTML) => {
    const element = document.querySelector(`.${className}`);
    element.innerHTML = innerHTML;
};

const setDayTime = (isDayTime) => {
    const dayTime = document.querySelector('#day-time');
    if (isDayTime) {
        dayTime.classList.remove('night');
        dayTime.classList.add('day');
    } else {
        dayTime.classList.add('night');
        dayTime.classList.remove('day');
    }
};

const updateIcon = (icon) => {
    const iconImg = document.querySelector('.icon > img');
    iconImg.setAttribute('src', `assets/${icon}.png`);
};

const updateInfo = ({ locationData, currentConditions }) => {
    updateElementByClass('condition', currentConditions.WeatherText);
    updateElementByClass('location', `${locationData.EnglishName}, ${locationData.Country.EnglishName}`);
    updateElementByClass('temp', `${currentConditions.Temperature.Metric.Value}&deg;C`);
    setDayTime(currentConditions.IsDayTime);
    updateIcon(currentConditions.WeatherIcon);
    card.classList.remove('d-none');
};

form.addEventListener('submit', e => {
    e.preventDefault();

    const location = form.location.value.trim();
    form.reset();

    fetchWeatherData(location)
        .then(data => updateInfo(data))
        .catch(err => console.log(err));

    favorites.push(location);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
});

const createFavorite = ({ locationData, currentConditions }) => {
    return `
    <div class="card rounded shadow">
        <div class="card-header">
            <h4 class="favorite-header mb-0">
                ${locationData.EnglishName}, ${locationData.Country.EnglishName}, ${currentConditions.Temperature.Metric.Value}&deg;C
            </h4>
        </div>
        <div class="collapse">
            <div class="card-body">
                <div class="${currentConditions.IsDayTime ? 'day' : 'night'} text-center">
                    <div class="pt-2">
                        <div class="cloud-one my-3"></div>
                        <span class="condition display-4 my-5 text-center">${currentConditions.WeatherText}</span>
                        <div class="icon text-center mx-auto">
                            <img src="assets/${currentConditions.WeatherIcon}.png" alt="icon representing current weather" width="125">
                        </div>
                        <div class="cloud-two my-3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};