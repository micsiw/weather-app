import weather from './api';

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
        temperature.innerHTML = Math.round(actualWeather.temp) + ' °C';
        wind.innerHTML = Math.round(3.6 * actualWeather.wind) + ' km/h';
        rain.innerHTML = actualWeather.rain * 100 + ' %';
        clouds.innerHTML = actualWeather.cloudiness + ' %';
    } catch(e) {
        alert(e);
    }
  
}

search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadData(search.value);
    }
});

export { loadData };