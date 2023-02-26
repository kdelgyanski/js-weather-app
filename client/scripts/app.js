const SERVER_URL = 'http://localhost:5555/api/weather';
const form = document.querySelector('form');
const card = document.querySelector('.card');

const fetchWeatherData = async (location) =>
    fetch(`${SERVER_URL}?location=${location}`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));

const updateElementByClass = (className, innerHTML) => {
    const element = document.querySelector(`.${className}`);
    element.innerHTML = innerHTML;
};

const setDayTime = (isDayTime) => {
    console.log(isDayTime);
    const dayTime = document.querySelector('#day-time');
    if (isDayTime) {
        dayTime.classList.remove('night');
        dayTime.classList.add('day');
    } else {
        dayTime.classList.add('night');
        dayTime.classList.remove('day');
    }
};

const updateInfo = ({ locationData, currentConditions }) => {
    updateElementByClass('condition', currentConditions.WeatherText);
    updateElementByClass('location', `${locationData.EnglishName}, ${locationData.Country.EnglishName}`);
    updateElementByClass('temp', `${currentConditions.Temperature.Metric.Value}&deg;C`);
    setDayTime(currentConditions.IsDayTime);
    card.classList.remove('d-none');
};

form.addEventListener('submit', e => {
    e.preventDefault();

    const location = form.location.value.trim();
    form.reset();

    fetchWeatherData(location)
        .then(data => updateInfo(data))
        .catch(err => console.log(err));
});