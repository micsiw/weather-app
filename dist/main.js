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

            return { secondDay, thirdDay, fourthDay }
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
        temperature.innerHTML = Math.round(actualWeather.temp) + ' °C';
        wind.innerHTML = Math.round(3.6 * actualWeather.wind) + ' km/h';
        rain.innerHTML = Math.round(actualWeather.rain * 100) + '%';
        clouds.innerHTML = actualWeather.cloudiness + '%';
    } catch(error) {
        alert(error);
    }

    try {
        const forecastWeather = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location).forecastData();
        console.log(forecastWeather);
    } catch(error) {
        alert(error)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0EsMkZBQTJGLFNBQVM7QUFDcEc7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3QkFBd0IsMEJBQTBCOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUEsaUVBQWUsT0FBTzs7Ozs7Ozs7Ozs7Ozs7O0FDakdNOztBQUU1Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsZ0RBQU87QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLHNDQUFzQyxnREFBTztBQUM3QztBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O1VDdkNEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOeUM7OztBQUd6QyxzREFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvYXBpLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL21vZHVsZXMvZG9tLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2VhdGhlciA9IChsb2NhdGlvbikgPT4ge1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P3E9JHtsb2NhdGlvbn0mYXBwaWQ9MTI0YWNkMzczMzE4MTc1MTJhZjQ5MzA2MTUzYTA0ZWUmdW5pdHM9bWV0cmljYCwge1xuICAgICAgICAgICAgbW9kZTogJ2NvcnMnXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0RGF0YSgpO1xuXG4gICAgICAgIGlmIChkYXRhLmNvZCA9PT0gJzQwNCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IGRhdGEuY2l0eS5uYW1lO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGRhdGEuY2l0eS5jb3VudHJ5O1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9IGRhdGEubGlzdFswXS53ZWF0aGVyWzBdLmljb247XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gZGF0YS5saXN0WzBdLm1haW4udGVtcDtcbiAgICAgICAgICAgIGNvbnN0IGNsb3VkaW5lc3MgPSBkYXRhLmxpc3RbMF0uY2xvdWRzLmFsbDtcbiAgICAgICAgICAgIGNvbnN0IHJhaW4gPSBkYXRhLmxpc3RbMF0ucG9wO1xuICAgICAgICAgICAgY29uc3Qgd2luZCA9IGRhdGEubGlzdFswXS53aW5kLnNwZWVkO1xuXG4gICAgICAgICAgICByZXR1cm4geyBsb2NhdGlvbiwgY291bnRyeSwgaWNvbiwgdGVtcCwgY2xvdWRpbmVzcywgcmFpbiwgd2luZCB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldERhdGEoKTtcbiAgICAgICAgY29uc3Qgd2Vla2RheSA9IFtcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdO1xuXG4gICAgICAgIGlmIChkYXRhLmNvZCA9PT0gJzQwNCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXlzID0gZm9yZWNhc3REYXlzKGRhdGEpO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF5ID0geyBcbiAgICAgICAgICAgICAgICBuYW1lOiB3ZWVrZGF5W25ldyBEYXRlKGRheXNbMF0uZHQgKiAxMDAwKS5nZXREYXkoKV0sXG4gICAgICAgICAgICAgICAgaWNvbjogZGF5c1swXS53ZWF0aGVyWzBdLmljb24sXG4gICAgICAgICAgICAgICAgZGF5VGVtcDogZGF5c1swXS5tYWluLnRlbXAsXG4gICAgICAgICAgICAgICAgbmlnaHRUZW1wOiBkYXlzWzFdLm1haW4udGVtcFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGhpcmREYXkgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogd2Vla2RheVtuZXcgRGF0ZShkYXlzWzJdLmR0ICogMTAwMCkuZ2V0RGF5KCldLFxuICAgICAgICAgICAgICAgIGljb246IGRheXNbMl0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICAgICAgICAgIGRheVRlbXA6IGRheXNbMl0ubWFpbi50ZW1wLFxuICAgICAgICAgICAgICAgIG5pZ2h0VGVtcDogZGF5c1szXS5tYWluLnRlbXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZvdXJ0aERheSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiB3ZWVrZGF5W25ldyBEYXRlKGRheXNbNF0uZHQgKiAxMDAwKS5nZXREYXkoKV0sXG4gICAgICAgICAgICAgICAgaWNvbjogZGF5c1s0XS53ZWF0aGVyWzBdLmljb24sXG4gICAgICAgICAgICAgICAgZGF5VGVtcDogZGF5c1s0XS5tYWluLnRlbXAsXG4gICAgICAgICAgICAgICAgbmlnaHRUZW1wOiBkYXlzWzVdLm1haW4udGVtcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geyBzZWNvbmREYXksIHRoaXJkRGF5LCBmb3VydGhEYXkgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9yZWNhc3REYXlzKGZvcmVjYXN0KSB7XG4gICAgICAgIGxldCBkYXlzID0gW107XG5cbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZShmb3JlY2FzdC5saXN0WzBdLmR0ICogMTAwMCk7XG4gICAgICAgIGNvbnN0IHRvZGF5VVRDID0gY29udmVydERhdGVUb1VUQyh0b2RheSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBmb3JlY2FzdC5saXN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZShmb3JlY2FzdC5saXN0W2ldLmR0ICogMTAwMCk7XG4gICAgICAgICAgICBjb25zdCB0aW1lVVRDID0gY29udmVydERhdGVUb1VUQyh0aW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGhvdXIgPSB0aW1lVVRDLmdldEhvdXJzKCk7XG4gICAgICAgICAgICBjb25zdCBkYXkgPSB0aW1lVVRDLmdldERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKGhvdXIgPT09IDAgJiYgZGF5ICE9PSB0b2RheVVUQy5nZXREYXRlKCkgfHwgaG91ciA9PT0gMTIgJiYgZGF5ICE9PSB0b2RheVVUQy5nZXREYXRlKCkpIHtcbiAgICAgICAgICAgICAgICBkYXlzLnB1c2goZm9yZWNhc3QubGlzdFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2ZpcnN0IHRpbWVzdGFtcCBmcm9tIHRoZSBhcnJheSBpcyBhbHdheXMgdGhlIG5pZ2h0IG9mIHByZXNlbnQgZGF5LCBhbmQgbGFzdCB0aW1lc3RhbXAgaXMgbGFja2luZyBuaWdodCBkYXRhLFxuICAgICAgICAvL2l0IGhhcHBlbnMgYmVjYXVzZSBpJ20gdXNpbmcgZnJlZSBvcGVud2VhdGhlciBwbGFuIHdpdGggMy1ob3VyIHN0ZXBcblxuICAgICAgICBkYXlzLnNoaWZ0KCk7XG4gICAgICAgIGRheXMucG9wKCk7XG4gICAgICAgIHJldHVybiBkYXlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnZlcnREYXRlVG9VVEMoZGF0ZSkgeyBcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxuICAgICAgICAgICAgZGF0ZS5nZXRVVENGdWxsWWVhcigpLCBcbiAgICAgICAgICAgIGRhdGUuZ2V0VVRDTW9udGgoKSwgXG4gICAgICAgICAgICBkYXRlLmdldFVUQ0RhdGUoKSwgXG4gICAgICAgICAgICBkYXRlLmdldFVUQ0hvdXJzKCksIFxuICAgICAgICAgICAgZGF0ZS5nZXRVVENNaW51dGVzKCksIFxuICAgICAgICAgICAgZGF0ZS5nZXRVVENTZWNvbmRzKCkpOyBcbiAgICAgICAgfVxuXG4gICAgcmV0dXJuIHsgd2VhdGhlckRhdGEsIGZvcmVjYXN0RGF0YSB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHdlYXRoZXI7IiwiaW1wb3J0IHdlYXRoZXIgZnJvbSAnLi9hcGknO1xuXG5jb25zdCBzZWFyY2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VhcmNoJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWREYXRhKGxvY2F0aW9uKSB7XG5cbiAgICBjb25zdCBjaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvY2F0aW9uJyk7XG4gICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY29uJyk7XG4gICAgY29uc3QgdGVtcGVyYXR1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGVyYXR1cmUnKTtcbiAgICBjb25zdCB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbmQnKTtcbiAgICBjb25zdCByYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhaW4nKTtcbiAgICBjb25zdCBjbG91ZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvdWRzJyk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBhY3R1YWxXZWF0aGVyID0gYXdhaXQgd2VhdGhlcihsb2NhdGlvbikud2VhdGhlckRhdGEoKTtcbiAgICAgICAgY29uc29sZS5sb2coYWN0dWFsV2VhdGhlcilcbiAgICAgICAgXG4gICAgICAgIGNpdHkuaW5uZXJIVE1MID0gYWN0dWFsV2VhdGhlci5sb2NhdGlvbiArICcsICcgKyBhY3R1YWxXZWF0aGVyLmNvdW50cnk7XG4gICAgICAgIHRlbXBlcmF0dXJlLmlubmVySFRNTCA9IE1hdGgucm91bmQoYWN0dWFsV2VhdGhlci50ZW1wKSArICcgwrBDJztcbiAgICAgICAgd2luZC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKDMuNiAqIGFjdHVhbFdlYXRoZXIud2luZCkgKyAnIGttL2gnO1xuICAgICAgICByYWluLmlubmVySFRNTCA9IE1hdGgucm91bmQoYWN0dWFsV2VhdGhlci5yYWluICogMTAwKSArICclJztcbiAgICAgICAgY2xvdWRzLmlubmVySFRNTCA9IGFjdHVhbFdlYXRoZXIuY2xvdWRpbmVzcyArICclJztcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB3ZWF0aGVyKGxvY2F0aW9uKS5mb3JlY2FzdERhdGEoKTtcbiAgICAgICAgY29uc29sZS5sb2coZm9yZWNhc3RXZWF0aGVyKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgIH1cbiAgXG59XG5cbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgIGxvYWREYXRhKHNlYXJjaC52YWx1ZSk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCB7IGxvYWREYXRhIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBsb2FkRGF0YSB9IGZyb20gXCIuL21vZHVsZXMvZG9tXCI7XG5cblxubG9hZERhdGEoXCJXYXJzYXdcIilcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==