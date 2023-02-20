async function getData() {
    const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?q=Warsaw&appid=124acd37331817512af49306153a04ee&units=metric", {
        mode: 'cors'
    });
    return await response.json();
}

getData().then(response => {
    console.log(response)
})

function getWeather() {

    const weather = {};

    getAcualWeather().then(response => {
        console.log(response)
        weather.icon = response.weather.icon;
        weather.temp = response.main.temp;
    })

}