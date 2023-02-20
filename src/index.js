
const weather = (location = 'Warsaw') => {

    async function getData() {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=124acd37331817512af49306153a04ee&units=metric`, {
            mode: 'cors'
        });
        return await response.json();
    }
    
    const weatherData = async function() {
        const data = await getData();
        const location = data.city.name;
        const country = data.city.country;
        const icon = data.list[0].weather[0].icon;
        const temp = data.list[0].main.temp;
        const cloudiness = data.list[0].clouds.all;
        const rain = data.list[0].pop;
        const wind = data.list[0].wind.speed;

        return { location, country, icon, temp, cloudiness, rain, wind }
    }

    return { weatherData }
}

weather().weatherData().then(r => {
    console.log(r)
})
