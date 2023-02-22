/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/api.js":
/*!****************************!*\
  !*** ./src/modules/api.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const weather = (location) => {

    async function getData() {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=124acd37331817512af49306153a04ee&units=metric`, {
            mode: 'cors'
        });
        return await response.json();
    }
    
    const weatherData = async function() {
        const data = await getData();

        if (data.cod === '404') {
            throw new Error(data.message)
        } else {
            const location = data.city.name;
            const country = data.city.country;
            const icon = data.list[0].weather[0].icon;
            const temp = data.list[0].main.temp;
            const cloudiness = data.list[0].clouds.all;
            const rain = data.list[0].pop;
            const wind = data.list[0].wind.speed;

            return { location, country, icon, temp, cloudiness, rain, wind }
        }
    }

    const forecastData = async function() {
        const data = await getData();
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        if (data.cod === '404') {
            throw new Error(data.message)
        } else {
            const days = forecastDays(data);
            const secondDay = { 
                name: weekday[new Date(days[0].dt * 1000).getDay()],
                icon: days[0].weather[0].icon,
                dayTemp: days[0].main.temp,
                nightTemp: days[1].main.temp
            }
            const thirdDay = {
                name: weekday[new Date(days[2].dt * 1000).getDay()],
                icon: days[2].weather[0].icon,
                dayTemp: days[2].main.temp,
                nightTemp: days[3].main.temp
            }
            const fourthDay = {
                name: weekday[new Date(days[4].dt * 1000).getDay()],
                icon: days[4].weather[0].icon,
                dayTemp: days[4].main.temp,
                nightTemp: days[5].main.temp
            }

            return [ secondDay, thirdDay, fourthDay ]
        }
    }

    function forecastDays(forecast) {
        let days = [];

        const today = new Date(forecast.list[0].dt * 1000);
        const todayUTC = convertDateToUTC(today);

        for (let i = 1; i < forecast.list.length; i++) {

            const time = new Date(forecast.list[i].dt * 1000);
            const timeUTC = convertDateToUTC(time);
            const hour = timeUTC.getHours();
            const day = timeUTC.getDate();

            if (hour === 0 && day !== todayUTC.getDate() || hour === 12 && day !== todayUTC.getDate()) {
                days.push(forecast.list[i]);
            }
        }

        //first timestamp from the array is always the night of present day, and last timestamp is lacking night data,
        //it happens because i'm using free openweather plan with 3-hour step

        days.shift();
        days.pop();
        return days;
    }

    function convertDateToUTC(date) { 
        return new Date(
            date.getUTCFullYear(), 
            date.getUTCMonth(), 
            date.getUTCDate(), 
            date.getUTCHours(), 
            date.getUTCMinutes(), 
            date.getUTCSeconds()); 
        }

    return { weatherData, forecastData }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (weather);

/***/ }),

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadData": () => (/* binding */ loadData)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./src/modules/api.js");


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
        const actualWeather = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location).weatherData();
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
        const forecastWeather = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location).forecastData();
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



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/dom */ "./src/modules/dom.js");



(0,_modules_dom__WEBPACK_IMPORTED_MODULE_0__.loadData)("Warsaw")

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsMkZBQTJGLFNBQVM7QUFDcEc7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsd0JBQXdCLDBCQUEwQjs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYTtBQUNiOztBQUVBLGlFQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7OztBQ2pHTTs7QUFFNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsZ0RBQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsZ0RBQU87QUFDN0M7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztVQy9GRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnlDOzs7QUFHekMsc0RBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdlYXRoZXIgPSAobG9jYXRpb24pID0+IHtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7bG9jYXRpb259JmFwcGlkPTEyNGFjZDM3MzMxODE3NTEyYWY0OTMwNjE1M2EwNGVlJnVuaXRzPW1ldHJpY2AsIHtcbiAgICAgICAgICAgIG1vZGU6ICdjb3JzJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldERhdGEoKTtcblxuICAgICAgICBpZiAoZGF0YS5jb2QgPT09ICc0MDQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSBkYXRhLmNpdHkubmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBkYXRhLmNpdHkuY291bnRyeTtcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSBkYXRhLmxpc3RbMF0ud2VhdGhlclswXS5pY29uO1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGRhdGEubGlzdFswXS5tYWluLnRlbXA7XG4gICAgICAgICAgICBjb25zdCBjbG91ZGluZXNzID0gZGF0YS5saXN0WzBdLmNsb3Vkcy5hbGw7XG4gICAgICAgICAgICBjb25zdCByYWluID0gZGF0YS5saXN0WzBdLnBvcDtcbiAgICAgICAgICAgIGNvbnN0IHdpbmQgPSBkYXRhLmxpc3RbMF0ud2luZC5zcGVlZDtcblxuICAgICAgICAgICAgcmV0dXJuIHsgbG9jYXRpb24sIGNvdW50cnksIGljb24sIHRlbXAsIGNsb3VkaW5lc3MsIHJhaW4sIHdpbmQgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZm9yZWNhc3REYXRhID0gYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXREYXRhKCk7XG4gICAgICAgIGNvbnN0IHdlZWtkYXkgPSBbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXTtcblxuICAgICAgICBpZiAoZGF0YS5jb2QgPT09ICc0MDQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF5cyA9IGZvcmVjYXN0RGF5cyhkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERheSA9IHsgXG4gICAgICAgICAgICAgICAgbmFtZTogd2Vla2RheVtuZXcgRGF0ZShkYXlzWzBdLmR0ICogMTAwMCkuZ2V0RGF5KCldLFxuICAgICAgICAgICAgICAgIGljb246IGRheXNbMF0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICAgICAgICAgIGRheVRlbXA6IGRheXNbMF0ubWFpbi50ZW1wLFxuICAgICAgICAgICAgICAgIG5pZ2h0VGVtcDogZGF5c1sxXS5tYWluLnRlbXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRoaXJkRGF5ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHdlZWtkYXlbbmV3IERhdGUoZGF5c1syXS5kdCAqIDEwMDApLmdldERheSgpXSxcbiAgICAgICAgICAgICAgICBpY29uOiBkYXlzWzJdLndlYXRoZXJbMF0uaWNvbixcbiAgICAgICAgICAgICAgICBkYXlUZW1wOiBkYXlzWzJdLm1haW4udGVtcCxcbiAgICAgICAgICAgICAgICBuaWdodFRlbXA6IGRheXNbM10ubWFpbi50ZW1wXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmb3VydGhEYXkgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogd2Vla2RheVtuZXcgRGF0ZShkYXlzWzRdLmR0ICogMTAwMCkuZ2V0RGF5KCldLFxuICAgICAgICAgICAgICAgIGljb246IGRheXNbNF0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICAgICAgICAgIGRheVRlbXA6IGRheXNbNF0ubWFpbi50ZW1wLFxuICAgICAgICAgICAgICAgIG5pZ2h0VGVtcDogZGF5c1s1XS5tYWluLnRlbXBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFsgc2Vjb25kRGF5LCB0aGlyZERheSwgZm91cnRoRGF5IF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcmVjYXN0RGF5cyhmb3JlY2FzdCkge1xuICAgICAgICBsZXQgZGF5cyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoZm9yZWNhc3QubGlzdFswXS5kdCAqIDEwMDApO1xuICAgICAgICBjb25zdCB0b2RheVVUQyA9IGNvbnZlcnREYXRlVG9VVEModG9kYXkpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZm9yZWNhc3QubGlzdC5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBjb25zdCB0aW1lID0gbmV3IERhdGUoZm9yZWNhc3QubGlzdFtpXS5kdCAqIDEwMDApO1xuICAgICAgICAgICAgY29uc3QgdGltZVVUQyA9IGNvbnZlcnREYXRlVG9VVEModGltZSk7XG4gICAgICAgICAgICBjb25zdCBob3VyID0gdGltZVVUQy5nZXRIb3VycygpO1xuICAgICAgICAgICAgY29uc3QgZGF5ID0gdGltZVVUQy5nZXREYXRlKCk7XG5cbiAgICAgICAgICAgIGlmIChob3VyID09PSAwICYmIGRheSAhPT0gdG9kYXlVVEMuZ2V0RGF0ZSgpIHx8IGhvdXIgPT09IDEyICYmIGRheSAhPT0gdG9kYXlVVEMuZ2V0RGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgZGF5cy5wdXNoKGZvcmVjYXN0Lmxpc3RbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9maXJzdCB0aW1lc3RhbXAgZnJvbSB0aGUgYXJyYXkgaXMgYWx3YXlzIHRoZSBuaWdodCBvZiBwcmVzZW50IGRheSwgYW5kIGxhc3QgdGltZXN0YW1wIGlzIGxhY2tpbmcgbmlnaHQgZGF0YSxcbiAgICAgICAgLy9pdCBoYXBwZW5zIGJlY2F1c2UgaSdtIHVzaW5nIGZyZWUgb3BlbndlYXRoZXIgcGxhbiB3aXRoIDMtaG91ciBzdGVwXG5cbiAgICAgICAgZGF5cy5zaGlmdCgpO1xuICAgICAgICBkYXlzLnBvcCgpO1xuICAgICAgICByZXR1cm4gZGF5cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0RGF0ZVRvVVRDKGRhdGUpIHsgXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShcbiAgICAgICAgICAgIGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgXG4gICAgICAgICAgICBkYXRlLmdldFVUQ01vbnRoKCksIFxuICAgICAgICAgICAgZGF0ZS5nZXRVVENEYXRlKCksIFxuICAgICAgICAgICAgZGF0ZS5nZXRVVENIb3VycygpLCBcbiAgICAgICAgICAgIGRhdGUuZ2V0VVRDTWludXRlcygpLCBcbiAgICAgICAgICAgIGRhdGUuZ2V0VVRDU2Vjb25kcygpKTsgXG4gICAgICAgIH1cblxuICAgIHJldHVybiB7IHdlYXRoZXJEYXRhLCBmb3JlY2FzdERhdGEgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB3ZWF0aGVyOyIsImltcG9ydCB3ZWF0aGVyIGZyb20gJy4vYXBpJztcblxuY29uc3Qgd2VhdGhlckljb25zID0ge1xuICAgIFwiMDFkXCI6IFwiLi9pbWFnZXMvY2xlYXItZGF5LnBuZ1wiLFxuICAgIFwiMDFuXCI6IFwiLi9pbWFnZXMvY2xlYXItbmlnaHQucG5nXCIsXG4gICAgXCIwMmRcIjogXCIuL2ltYWdlcy9jbG91ZHktZGF5LnBuZ1wiLFxuICAgIFwiMDJuXCI6IFwiLi9pbWFnZXMvY2xvdWR5LW5pZ2h0LnBuZ1wiLFxuICAgIFwiMDNkXCI6IFwiLi9pbWFnZXMvc2NhdHRlcmVkLWNsb3Vkcy5wbmdcIixcbiAgICBcIjAzblwiOiBcIi4vaW1hZ2VzL3NjYXR0ZXJlZC1jbG91ZHMucG5nXCIsXG4gICAgXCIwNGRcIjogXCIuL2ltYWdlcy9icm9rZW4tY2xvdWRzLnBuZ1wiLFxuICAgIFwiMDRuXCI6IFwiLi9pbWFnZXMvYnJva2VuLWNsb3Vkcy5wbmdcIixcbiAgICBcIjA5ZFwiOiBcIi4vaW1hZ2VzL3Nob3dlci1yYWluLnBuZ1wiLFxuICAgIFwiMDluXCI6IFwiLi9pbWFnZXMvc2hvd2VyLXJhaW4ucG5nXCIsXG4gICAgXCIxMGRcIjogXCIuL2ltYWdlcy9yYWluLWRheS5wbmdcIixcbiAgICBcIjEwblwiOiBcIi4vaW1hZ2VzL3JhaW4tbmlnaHQucG5nXCIsXG4gICAgXCIxMWRcIjogXCIuL2ltYWdlcy9zdG9ybS5wbmdcIixcbiAgICBcIjExblwiOiBcIi4vaW1hZ2VzL3N0b3JtLnBuZ1wiLFxuICAgIFwiMTNkXCI6IFwiLi9pbWFnZXMvc25vd3kucG5nXCIsXG4gICAgXCIxM25cIjogXCIuL2ltYWdlcy9zbm93eS5wbmdcIixcbiAgICBcIjUwZFwiOiBcIi4vaW1hZ2VzL21pc3QucG5nXCIsXG4gICAgXCI1MG5cIjogXCIuL2ltYWdlcy9taXN0LnBuZ1wiXG59XG5cbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWFyY2gnKTtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZERhdGEobG9jYXRpb24pIHtcblxuICAgIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9jYXRpb24nKTtcbiAgICBjb25zdCBpY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmljb24nKTtcbiAgICBjb25zdCB0ZW1wZXJhdHVyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wZXJhdHVyZScpO1xuICAgIGNvbnN0IHdpbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luZCcpO1xuICAgIGNvbnN0IHJhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFpbicpO1xuICAgIGNvbnN0IGNsb3VkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG91ZHMnKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFjdHVhbFdlYXRoZXIgPSBhd2FpdCB3ZWF0aGVyKGxvY2F0aW9uKS53ZWF0aGVyRGF0YSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhhY3R1YWxXZWF0aGVyKVxuICAgICAgICBcbiAgICAgICAgY2l0eS5pbm5lckhUTUwgPSBhY3R1YWxXZWF0aGVyLmxvY2F0aW9uICsgJywgJyArIGFjdHVhbFdlYXRoZXIuY291bnRyeTtcbiAgICAgICAgaWNvbi5zcmMgPSB3ZWF0aGVySWNvbnNbYWN0dWFsV2VhdGhlci5pY29uXTtcbiAgICAgICAgdGVtcGVyYXR1cmUuaW5uZXJIVE1MID0gTWF0aC5yb3VuZChhY3R1YWxXZWF0aGVyLnRlbXApICsgJyDCsEMnO1xuICAgICAgICB3aW5kLmlubmVySFRNTCA9IE1hdGgucm91bmQoMy42ICogYWN0dWFsV2VhdGhlci53aW5kKSArICcga20vaCc7XG4gICAgICAgIHJhaW4uaW5uZXJIVE1MID0gTWF0aC5yb3VuZChhY3R1YWxXZWF0aGVyLnJhaW4gKiAxMDApICsgJyUnO1xuICAgICAgICBjbG91ZHMuaW5uZXJIVE1MID0gYWN0dWFsV2VhdGhlci5jbG91ZGluZXNzICsgJyUnO1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcmVjYXN0Q2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9yZWNhc3QtY2FyZHMnKTtcbiAgICBmb3JlY2FzdENhcmRzLmlubmVySFRNTCA9ICcnO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZm9yZWNhc3RXZWF0aGVyID0gYXdhaXQgd2VhdGhlcihsb2NhdGlvbikuZm9yZWNhc3REYXRhKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGZvcmVjYXN0V2VhdGhlcik7XG5cbiAgICAgICAgZm9yZWNhc3RXZWF0aGVyLmZvckVhY2goZm9yZWNhc3QgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2ZvcmVjYXN0Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcmVjYXN0RGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBmb3JlY2FzdERheS5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1kYXknKTtcbiAgICAgICAgICAgIGZvcmVjYXN0RGF5LmlubmVySFRNTCA9IGZvcmVjYXN0Lm5hbWU7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZvcmVjYXN0RGF5KTtcblxuICAgICAgICAgICAgY29uc3QgZm9yZWNhc3RJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgICBmb3JlY2FzdEljb24uY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtaWNvbicpO1xuICAgICAgICAgICAgZm9yZWNhc3RJY29uLnNyYyA9IHdlYXRoZXJJY29uc1tmb3JlY2FzdC5pY29uXTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZm9yZWNhc3RJY29uKTtcblxuICAgICAgICAgICAgY29uc3QgZm9yZWNhc3RUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBmb3JlY2FzdFRlbXAuY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtdGVtcCcpO1xuXG4gICAgICAgICAgICBjb25zdCBkYXlUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgZGF5VGVtcC5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1kYXktdGVtcCcpO1xuICAgICAgICAgICAgZGF5VGVtcC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKGZvcmVjYXN0LmRheVRlbXApICsgJyDCsEMnO1xuICAgICAgICAgICAgZm9yZWNhc3RUZW1wLmFwcGVuZENoaWxkKGRheVRlbXApO1xuXG4gICAgICAgICAgICBjb25zdCBuaWdodFRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICBuaWdodFRlbXAuY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtbmlnaHQtdGVtcCcpO1xuICAgICAgICAgICAgbmlnaHRUZW1wLmlubmVySFRNTCA9IE1hdGgucm91bmQoZm9yZWNhc3QubmlnaHRUZW1wKSArICcgwrBDJztcbiAgICAgICAgICAgIGZvcmVjYXN0VGVtcC5hcHBlbmRDaGlsZChuaWdodFRlbXApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZvcmVjYXN0VGVtcCk7XG4gICAgICAgICAgICBmb3JlY2FzdENhcmRzLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuICAgICAgICB9KVxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgfVxufVxuXG5zZWFyY2guYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICBsb2FkRGF0YShzZWFyY2gudmFsdWUpO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgeyBsb2FkRGF0YSB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbG9hZERhdGEgfSBmcm9tIFwiLi9tb2R1bGVzL2RvbVwiO1xuXG5cbmxvYWREYXRhKFwiV2Fyc2F3XCIpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=