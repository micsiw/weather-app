import weather from './api';

const weatherIcons = {
    "01d": "./images/clear-day.png",
    "01n": "./images/clear-night.png",
    "02d": "./images/cloudy-day.png",
    "02n": "./images/cloudy-night.png",
    "03d": "./images/scattered-clouds.png",
    "03n": "./images/scattered-clouds.png",
    "04d": "./images/broken-clouds.png",
    "04n": "./images/broken-clouds.png",
    "09d": "./images/shower-rain.png",
    "09n": "./images/shower-rain.png",
    "10d": "./images/rain-day.png",
    "10n": "./images/rain-night.png",
    "11d": "./images/storm.png",
    "11n": "./images/storm.png",
    "13d": "./images/snowy.png",
    "13n": "./images/snowy.png",
    "50d": "./images/mist.png",
    "50n": "./images/mist.png"
}

const search = document.querySelector('#search');

async function loadData(location) {

    const city = document.querySelector('.location');
    const icon = document.querySelector('.icon');
    const temperature = document.querySelector('.temperature');
    const wind = document.querySelector('.wind');
    const rain = document.querySelector('.rain');
    const clouds = document.querySelector('.clouds');

    try {
        const actualWeather = await weather(location).weatherData();
        console.log(actualWeather)
        
        city.innerHTML = actualWeather.location + ', ' + actualWeather.country;
        icon.src = weatherIcons[actualWeather.icon];
        temperature.innerHTML = Math.round(actualWeather.temp) + ' °C';
        wind.innerHTML = Math.round(3.6 * actualWeather.wind) + ' km/h';
        rain.innerHTML = Math.round(actualWeather.rain * 100) + '%';
        clouds.innerHTML = actualWeather.cloudiness + '%';
    } catch(error) {
        alert(error);
    }

    const forecastCards = document.querySelector('.forecast-cards');
    forecastCards.innerHTML = '';

    try {
        const forecastWeather = await weather(location).forecastData();
        console.log(forecastWeather);

        forecastWeather.forEach(forecast => {

            const wrapper = document.createElement('div');
            wrapper.classList.add('forecast');

            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            forecastDay.innerHTML = forecast.name;
            wrapper.appendChild(forecastDay);

            const forecastIcon = document.createElement('img');
            forecastIcon.classList.add('forecast-icon');
            forecastIcon.src = weatherIcons[forecast.icon];
            wrapper.appendChild(forecastIcon);

            const forecastTemp = document.createElement('div');
            forecastTemp.classList.add('forecast-temp');

            const dayTemp = document.createElement('span');
            dayTemp.classList.add('forecast-day-temp');
            dayTemp.innerHTML = Math.round(forecast.dayTemp) + ' °C';
            forecastTemp.appendChild(dayTemp);

            const nightTemp = document.createElement('span');
            nightTemp.classList.add('forecast-night-temp');
            nightTemp.innerHTML = Math.round(forecast.nightTemp) + ' °C';
            forecastTemp.appendChild(nightTemp);
            
            wrapper.appendChild(forecastTemp);
            forecastCards.appendChild(wrapper);
        })
    } catch(error) {
        console.log(error)
    }
}

search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadData(search.value);
    }
});

export { loadData };