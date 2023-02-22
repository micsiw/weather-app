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

export default weather;
