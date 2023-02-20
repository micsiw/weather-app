/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/

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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTs7QUFFQTtBQUNBLDJGQUEyRixTQUFTO0FBQ3BHO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7QUFDakI7O0FBRUEsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCB3ZWF0aGVyID0gKGxvY2F0aW9uID0gJ1dhcnNhdycpID0+IHtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7bG9jYXRpb259JmFwcGlkPTEyNGFjZDM3MzMxODE3NTEyYWY0OTMwNjE1M2EwNGVlJnVuaXRzPW1ldHJpY2AsIHtcbiAgICAgICAgICAgIG1vZGU6ICdjb3JzJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldERhdGEoKTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBkYXRhLmNpdHkubmFtZTtcbiAgICAgICAgY29uc3QgY291bnRyeSA9IGRhdGEuY2l0eS5jb3VudHJ5O1xuICAgICAgICBjb25zdCBpY29uID0gZGF0YS5saXN0WzBdLndlYXRoZXJbMF0uaWNvbjtcbiAgICAgICAgY29uc3QgdGVtcCA9IGRhdGEubGlzdFswXS5tYWluLnRlbXA7XG4gICAgICAgIGNvbnN0IGNsb3VkaW5lc3MgPSBkYXRhLmxpc3RbMF0uY2xvdWRzLmFsbDtcbiAgICAgICAgY29uc3QgcmFpbiA9IGRhdGEubGlzdFswXS5wb3A7XG4gICAgICAgIGNvbnN0IHdpbmQgPSBkYXRhLmxpc3RbMF0ud2luZC5zcGVlZDtcblxuICAgICAgICByZXR1cm4geyBsb2NhdGlvbiwgY291bnRyeSwgaWNvbiwgdGVtcCwgY2xvdWRpbmVzcywgcmFpbiwgd2luZCB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd2VhdGhlckRhdGEgfVxufVxuXG53ZWF0aGVyKCkud2VhdGhlckRhdGEoKS50aGVuKHIgPT4ge1xuICAgIGNvbnNvbGUubG9nKHIpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9