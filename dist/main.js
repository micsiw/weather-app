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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=124acd37331817512af49306153a04ee&units=metric`,
      {
        mode: "cors",
      }
    );
    return await response.json();
  }

  const weatherData = async function () {
    const data = await getData();

    if (data.cod === "404") {
      throw new Error(data.message);
    } else {
      const location = data.city.name;
      const country = data.city.country;
      const icon = data.list[0].weather[0].icon;
      const temp = data.list[0].main.temp;
      const cloudiness = data.list[0].clouds.all;
      const rain = data.list[0].pop;
      const wind = data.list[0].wind.speed;

      return { location, country, icon, temp, cloudiness, rain, wind };
    }
  };

  const forecastData = async function () {
    const data = await getData();
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    if (data.cod === "404") {
      throw new Error(data.message);
    } else {
      const days = forecastDays(data);
      const secondDay = {
        name: weekday[new Date(days[0].dt * 1000).getDay()],
        icon: days[0].weather[0].icon,
        dayTemp: days[0].main.temp,
        nightTemp: days[1].main.temp,
      };
      const thirdDay = {
        name: weekday[new Date(days[2].dt * 1000).getDay()],
        icon: days[2].weather[0].icon,
        dayTemp: days[2].main.temp,
        nightTemp: days[3].main.temp,
      };
      const fourthDay = {
        name: weekday[new Date(days[4].dt * 1000).getDay()],
        icon: days[4].weather[0].icon,
        dayTemp: days[4].main.temp,
        nightTemp: days[5].main.temp,
      };

      return [secondDay, thirdDay, fourthDay];
    }
  };

  function forecastDays(forecast) {
    let days = [];

    const today = new Date(forecast.list[0].dt * 1000);
    const todayUTC = convertDateToUTC(today);

    for (let i = 1; i < forecast.list.length; i++) {
      const time = new Date(forecast.list[i].dt * 1000);
      const timeUTC = convertDateToUTC(time);
      const hour = timeUTC.getHours();
      const day = timeUTC.getDate();

      if (
        (hour === 0 && day !== todayUTC.getDate()) ||
        (hour === 12 && day !== todayUTC.getDate())
      ) {
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
      date.getUTCSeconds()
    );
  }

  return { weatherData, forecastData };
};

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
  "50n": "./images/mist.png",
};

const search = document.querySelector("#search");

async function loadData(location) {
  const city = document.querySelector(".location");
  const icon = document.querySelector(".icon");
  const temperature = document.querySelector(".temperature");
  const wind = document.querySelector(".wind");
  const rain = document.querySelector(".rain");
  const clouds = document.querySelector(".clouds");

  try {
    const actualWeather = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location).weatherData();
    console.log(actualWeather);

    city.innerHTML = actualWeather.location + ", " + actualWeather.country;
    icon.src = weatherIcons[actualWeather.icon];
    temperature.innerHTML = Math.round(actualWeather.temp) + " °C";
    wind.innerHTML = Math.round(3.6 * actualWeather.wind) + " km/h";
    rain.innerHTML = Math.round(actualWeather.rain * 100) + "%";
    clouds.innerHTML = actualWeather.cloudiness + "%";
  } catch (error) {
    alert(error);
  }

  const forecastCards = document.querySelector(".forecast-cards");
  forecastCards.innerHTML = "";

  try {
    const forecastWeather = await (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location).forecastData();
    console.log(forecastWeather);

    forecastWeather.forEach((forecast) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("forecast");

      const forecastDay = document.createElement("div");
      forecastDay.classList.add("forecast-day");
      forecastDay.innerHTML = forecast.name;
      wrapper.appendChild(forecastDay);

      const forecastIcon = document.createElement("img");
      forecastIcon.classList.add("forecast-icon");
      forecastIcon.src = weatherIcons[forecast.icon];
      wrapper.appendChild(forecastIcon);

      const forecastTemp = document.createElement("div");
      forecastTemp.classList.add("forecast-temp");

      const dayTemp = document.createElement("span");
      dayTemp.classList.add("forecast-day-temp");
      dayTemp.innerHTML = Math.round(forecast.dayTemp) + "°C";
      forecastTemp.appendChild(dayTemp);

      const nightTemp = document.createElement("span");
      nightTemp.classList.add("forecast-night-temp");
      nightTemp.innerHTML = Math.round(forecast.nightTemp) + "°C";
      forecastTemp.appendChild(nightTemp);

      wrapper.appendChild(forecastTemp);
      forecastCards.appendChild(wrapper);
    });
  } catch (error) {
    console.log(error);
  }
}

search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
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


(0,_modules_dom__WEBPACK_IMPORTED_MODULE_0__.loadData)("Warsaw");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxTQUFTO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLDBCQUEwQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQSxpRUFBZSxPQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5R0s7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQyxnREFBTztBQUN6Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVtQjs7Ozs7OztVQy9GcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ055Qzs7QUFFekMsc0RBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdlYXRoZXIgPSAobG9jYXRpb24pID0+IHtcbiAgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7bG9jYXRpb259JmFwcGlkPTEyNGFjZDM3MzMxODE3NTEyYWY0OTMwNjE1M2EwNGVlJnVuaXRzPW1ldHJpY2AsXG4gICAgICB7XG4gICAgICAgIG1vZGU6IFwiY29yc1wiLFxuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuXG4gIGNvbnN0IHdlYXRoZXJEYXRhID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXREYXRhKCk7XG5cbiAgICBpZiAoZGF0YS5jb2QgPT09IFwiNDA0XCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsb2NhdGlvbiA9IGRhdGEuY2l0eS5uYW1lO1xuICAgICAgY29uc3QgY291bnRyeSA9IGRhdGEuY2l0eS5jb3VudHJ5O1xuICAgICAgY29uc3QgaWNvbiA9IGRhdGEubGlzdFswXS53ZWF0aGVyWzBdLmljb247XG4gICAgICBjb25zdCB0ZW1wID0gZGF0YS5saXN0WzBdLm1haW4udGVtcDtcbiAgICAgIGNvbnN0IGNsb3VkaW5lc3MgPSBkYXRhLmxpc3RbMF0uY2xvdWRzLmFsbDtcbiAgICAgIGNvbnN0IHJhaW4gPSBkYXRhLmxpc3RbMF0ucG9wO1xuICAgICAgY29uc3Qgd2luZCA9IGRhdGEubGlzdFswXS53aW5kLnNwZWVkO1xuXG4gICAgICByZXR1cm4geyBsb2NhdGlvbiwgY291bnRyeSwgaWNvbiwgdGVtcCwgY2xvdWRpbmVzcywgcmFpbiwgd2luZCB9O1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBmb3JlY2FzdERhdGEgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldERhdGEoKTtcbiAgICBjb25zdCB3ZWVrZGF5ID0gW1xuICAgICAgXCJTdW5kYXlcIixcbiAgICAgIFwiTW9uZGF5XCIsXG4gICAgICBcIlR1ZXNkYXlcIixcbiAgICAgIFwiV2VkbmVzZGF5XCIsXG4gICAgICBcIlRodXJzZGF5XCIsXG4gICAgICBcIkZyaWRheVwiLFxuICAgICAgXCJTYXR1cmRheVwiLFxuICAgIF07XG5cbiAgICBpZiAoZGF0YS5jb2QgPT09IFwiNDA0XCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkYXlzID0gZm9yZWNhc3REYXlzKGRhdGEpO1xuICAgICAgY29uc3Qgc2Vjb25kRGF5ID0ge1xuICAgICAgICBuYW1lOiB3ZWVrZGF5W25ldyBEYXRlKGRheXNbMF0uZHQgKiAxMDAwKS5nZXREYXkoKV0sXG4gICAgICAgIGljb246IGRheXNbMF0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICBkYXlUZW1wOiBkYXlzWzBdLm1haW4udGVtcCxcbiAgICAgICAgbmlnaHRUZW1wOiBkYXlzWzFdLm1haW4udGVtcCxcbiAgICAgIH07XG4gICAgICBjb25zdCB0aGlyZERheSA9IHtcbiAgICAgICAgbmFtZTogd2Vla2RheVtuZXcgRGF0ZShkYXlzWzJdLmR0ICogMTAwMCkuZ2V0RGF5KCldLFxuICAgICAgICBpY29uOiBkYXlzWzJdLndlYXRoZXJbMF0uaWNvbixcbiAgICAgICAgZGF5VGVtcDogZGF5c1syXS5tYWluLnRlbXAsXG4gICAgICAgIG5pZ2h0VGVtcDogZGF5c1szXS5tYWluLnRlbXAsXG4gICAgICB9O1xuICAgICAgY29uc3QgZm91cnRoRGF5ID0ge1xuICAgICAgICBuYW1lOiB3ZWVrZGF5W25ldyBEYXRlKGRheXNbNF0uZHQgKiAxMDAwKS5nZXREYXkoKV0sXG4gICAgICAgIGljb246IGRheXNbNF0ud2VhdGhlclswXS5pY29uLFxuICAgICAgICBkYXlUZW1wOiBkYXlzWzRdLm1haW4udGVtcCxcbiAgICAgICAgbmlnaHRUZW1wOiBkYXlzWzVdLm1haW4udGVtcCxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBbc2Vjb25kRGF5LCB0aGlyZERheSwgZm91cnRoRGF5XTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZm9yZWNhc3REYXlzKGZvcmVjYXN0KSB7XG4gICAgbGV0IGRheXMgPSBbXTtcblxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoZm9yZWNhc3QubGlzdFswXS5kdCAqIDEwMDApO1xuICAgIGNvbnN0IHRvZGF5VVRDID0gY29udmVydERhdGVUb1VUQyh0b2RheSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGZvcmVjYXN0Lmxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZShmb3JlY2FzdC5saXN0W2ldLmR0ICogMTAwMCk7XG4gICAgICBjb25zdCB0aW1lVVRDID0gY29udmVydERhdGVUb1VUQyh0aW1lKTtcbiAgICAgIGNvbnN0IGhvdXIgPSB0aW1lVVRDLmdldEhvdXJzKCk7XG4gICAgICBjb25zdCBkYXkgPSB0aW1lVVRDLmdldERhdGUoKTtcblxuICAgICAgaWYgKFxuICAgICAgICAoaG91ciA9PT0gMCAmJiBkYXkgIT09IHRvZGF5VVRDLmdldERhdGUoKSkgfHxcbiAgICAgICAgKGhvdXIgPT09IDEyICYmIGRheSAhPT0gdG9kYXlVVEMuZ2V0RGF0ZSgpKVxuICAgICAgKSB7XG4gICAgICAgIGRheXMucHVzaChmb3JlY2FzdC5saXN0W2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL2ZpcnN0IHRpbWVzdGFtcCBmcm9tIHRoZSBhcnJheSBpcyBhbHdheXMgdGhlIG5pZ2h0IG9mIHByZXNlbnQgZGF5LCBhbmQgbGFzdCB0aW1lc3RhbXAgaXMgbGFja2luZyBuaWdodCBkYXRhLFxuICAgIC8vaXQgaGFwcGVucyBiZWNhdXNlIGknbSB1c2luZyBmcmVlIG9wZW53ZWF0aGVyIHBsYW4gd2l0aCAzLWhvdXIgc3RlcFxuXG4gICAgZGF5cy5zaGlmdCgpO1xuICAgIGRheXMucG9wKCk7XG4gICAgcmV0dXJuIGRheXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0RGF0ZVRvVVRDKGRhdGUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoXG4gICAgICBkYXRlLmdldFVUQ0Z1bGxZZWFyKCksXG4gICAgICBkYXRlLmdldFVUQ01vbnRoKCksXG4gICAgICBkYXRlLmdldFVUQ0RhdGUoKSxcbiAgICAgIGRhdGUuZ2V0VVRDSG91cnMoKSxcbiAgICAgIGRhdGUuZ2V0VVRDTWludXRlcygpLFxuICAgICAgZGF0ZS5nZXRVVENTZWNvbmRzKClcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHsgd2VhdGhlckRhdGEsIGZvcmVjYXN0RGF0YSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgd2VhdGhlcjtcbiIsImltcG9ydCB3ZWF0aGVyIGZyb20gXCIuL2FwaVwiO1xuXG5jb25zdCB3ZWF0aGVySWNvbnMgPSB7XG4gIFwiMDFkXCI6IFwiLi9pbWFnZXMvY2xlYXItZGF5LnBuZ1wiLFxuICBcIjAxblwiOiBcIi4vaW1hZ2VzL2NsZWFyLW5pZ2h0LnBuZ1wiLFxuICBcIjAyZFwiOiBcIi4vaW1hZ2VzL2Nsb3VkeS1kYXkucG5nXCIsXG4gIFwiMDJuXCI6IFwiLi9pbWFnZXMvY2xvdWR5LW5pZ2h0LnBuZ1wiLFxuICBcIjAzZFwiOiBcIi4vaW1hZ2VzL3NjYXR0ZXJlZC1jbG91ZHMucG5nXCIsXG4gIFwiMDNuXCI6IFwiLi9pbWFnZXMvc2NhdHRlcmVkLWNsb3Vkcy5wbmdcIixcbiAgXCIwNGRcIjogXCIuL2ltYWdlcy9icm9rZW4tY2xvdWRzLnBuZ1wiLFxuICBcIjA0blwiOiBcIi4vaW1hZ2VzL2Jyb2tlbi1jbG91ZHMucG5nXCIsXG4gIFwiMDlkXCI6IFwiLi9pbWFnZXMvc2hvd2VyLXJhaW4ucG5nXCIsXG4gIFwiMDluXCI6IFwiLi9pbWFnZXMvc2hvd2VyLXJhaW4ucG5nXCIsXG4gIFwiMTBkXCI6IFwiLi9pbWFnZXMvcmFpbi1kYXkucG5nXCIsXG4gIFwiMTBuXCI6IFwiLi9pbWFnZXMvcmFpbi1uaWdodC5wbmdcIixcbiAgXCIxMWRcIjogXCIuL2ltYWdlcy9zdG9ybS5wbmdcIixcbiAgXCIxMW5cIjogXCIuL2ltYWdlcy9zdG9ybS5wbmdcIixcbiAgXCIxM2RcIjogXCIuL2ltYWdlcy9zbm93eS5wbmdcIixcbiAgXCIxM25cIjogXCIuL2ltYWdlcy9zbm93eS5wbmdcIixcbiAgXCI1MGRcIjogXCIuL2ltYWdlcy9taXN0LnBuZ1wiLFxuICBcIjUwblwiOiBcIi4vaW1hZ2VzL21pc3QucG5nXCIsXG59O1xuXG5jb25zdCBzZWFyY2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlYXJjaFwiKTtcblxuYXN5bmMgZnVuY3Rpb24gbG9hZERhdGEobG9jYXRpb24pIHtcbiAgY29uc3QgY2l0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb25cIik7XG4gIGNvbnN0IGljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmljb25cIik7XG4gIGNvbnN0IHRlbXBlcmF0dXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZW1wZXJhdHVyZVwiKTtcbiAgY29uc3Qgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZFwiKTtcbiAgY29uc3QgcmFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmFpblwiKTtcbiAgY29uc3QgY2xvdWRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG91ZHNcIik7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhY3R1YWxXZWF0aGVyID0gYXdhaXQgd2VhdGhlcihsb2NhdGlvbikud2VhdGhlckRhdGEoKTtcbiAgICBjb25zb2xlLmxvZyhhY3R1YWxXZWF0aGVyKTtcblxuICAgIGNpdHkuaW5uZXJIVE1MID0gYWN0dWFsV2VhdGhlci5sb2NhdGlvbiArIFwiLCBcIiArIGFjdHVhbFdlYXRoZXIuY291bnRyeTtcbiAgICBpY29uLnNyYyA9IHdlYXRoZXJJY29uc1thY3R1YWxXZWF0aGVyLmljb25dO1xuICAgIHRlbXBlcmF0dXJlLmlubmVySFRNTCA9IE1hdGgucm91bmQoYWN0dWFsV2VhdGhlci50ZW1wKSArIFwiIMKwQ1wiO1xuICAgIHdpbmQuaW5uZXJIVE1MID0gTWF0aC5yb3VuZCgzLjYgKiBhY3R1YWxXZWF0aGVyLndpbmQpICsgXCIga20vaFwiO1xuICAgIHJhaW4uaW5uZXJIVE1MID0gTWF0aC5yb3VuZChhY3R1YWxXZWF0aGVyLnJhaW4gKiAxMDApICsgXCIlXCI7XG4gICAgY2xvdWRzLmlubmVySFRNTCA9IGFjdHVhbFdlYXRoZXIuY2xvdWRpbmVzcyArIFwiJVwiO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGFsZXJ0KGVycm9yKTtcbiAgfVxuXG4gIGNvbnN0IGZvcmVjYXN0Q2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcmVjYXN0LWNhcmRzXCIpO1xuICBmb3JlY2FzdENhcmRzLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBmb3JlY2FzdFdlYXRoZXIgPSBhd2FpdCB3ZWF0aGVyKGxvY2F0aW9uKS5mb3JlY2FzdERhdGEoKTtcbiAgICBjb25zb2xlLmxvZyhmb3JlY2FzdFdlYXRoZXIpO1xuXG4gICAgZm9yZWNhc3RXZWF0aGVyLmZvckVhY2goKGZvcmVjYXN0KSA9PiB7XG4gICAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImZvcmVjYXN0XCIpO1xuXG4gICAgICBjb25zdCBmb3JlY2FzdERheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBmb3JlY2FzdERheS5jbGFzc0xpc3QuYWRkKFwiZm9yZWNhc3QtZGF5XCIpO1xuICAgICAgZm9yZWNhc3REYXkuaW5uZXJIVE1MID0gZm9yZWNhc3QubmFtZTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZm9yZWNhc3REYXkpO1xuXG4gICAgICBjb25zdCBmb3JlY2FzdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgZm9yZWNhc3RJY29uLmNsYXNzTGlzdC5hZGQoXCJmb3JlY2FzdC1pY29uXCIpO1xuICAgICAgZm9yZWNhc3RJY29uLnNyYyA9IHdlYXRoZXJJY29uc1tmb3JlY2FzdC5pY29uXTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZm9yZWNhc3RJY29uKTtcblxuICAgICAgY29uc3QgZm9yZWNhc3RUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGZvcmVjYXN0VGVtcC5jbGFzc0xpc3QuYWRkKFwiZm9yZWNhc3QtdGVtcFwiKTtcblxuICAgICAgY29uc3QgZGF5VGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgZGF5VGVtcC5jbGFzc0xpc3QuYWRkKFwiZm9yZWNhc3QtZGF5LXRlbXBcIik7XG4gICAgICBkYXlUZW1wLmlubmVySFRNTCA9IE1hdGgucm91bmQoZm9yZWNhc3QuZGF5VGVtcCkgKyBcIsKwQ1wiO1xuICAgICAgZm9yZWNhc3RUZW1wLmFwcGVuZENoaWxkKGRheVRlbXApO1xuXG4gICAgICBjb25zdCBuaWdodFRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIG5pZ2h0VGVtcC5jbGFzc0xpc3QuYWRkKFwiZm9yZWNhc3QtbmlnaHQtdGVtcFwiKTtcbiAgICAgIG5pZ2h0VGVtcC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKGZvcmVjYXN0Lm5pZ2h0VGVtcCkgKyBcIsKwQ1wiO1xuICAgICAgZm9yZWNhc3RUZW1wLmFwcGVuZENoaWxkKG5pZ2h0VGVtcCk7XG5cbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZm9yZWNhc3RUZW1wKTtcbiAgICAgIGZvcmVjYXN0Q2FyZHMuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9XG59XG5cbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGUpID0+IHtcbiAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICBsb2FkRGF0YShzZWFyY2gudmFsdWUpO1xuICB9XG59KTtcblxuZXhwb3J0IHsgbG9hZERhdGEgfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbG9hZERhdGEgfSBmcm9tIFwiLi9tb2R1bGVzL2RvbVwiO1xuXG5sb2FkRGF0YShcIldhcnNhd1wiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==