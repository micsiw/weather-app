/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L2ZvcmVjYXN0P3E9V2Fyc2F3JmFwcGlkPTEyNGFjZDM3MzMxODE3NTEyYWY0OTMwNjE1M2EwNGVlJnVuaXRzPW1ldHJpY1wiLCB7XG4gICAgICAgIG1vZGU6ICdjb3JzJ1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG59XG5cbmdldERhdGEoKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbn0pXG5cbmZ1bmN0aW9uIGdldFdlYXRoZXIoKSB7XG5cbiAgICBjb25zdCB3ZWF0aGVyID0ge307XG5cbiAgICBnZXRBY3VhbFdlYXRoZXIoKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgIHdlYXRoZXIuaWNvbiA9IHJlc3BvbnNlLndlYXRoZXIuaWNvbjtcbiAgICAgICAgd2VhdGhlci50ZW1wID0gcmVzcG9uc2UubWFpbi50ZW1wO1xuICAgIH0pXG5cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=