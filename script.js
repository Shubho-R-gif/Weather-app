const searchBtn = document.getElementById("searchBtn");
const apiKey = "IWcBUGtj75GDgYiyxbuvP5WkHt3tEdtz";

async function getLocation(locations) {
  const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${locations}&details=true&offset=true`;
  const fetchingLocation = await fetch(locationUrl);
  const locationData = await fetchingLocation.json();
  if (locationData.length > 0) {
    return locationData[0].Key;
  } else {
    throw new Error("Location not found");
  }
}

async function weatherCast(locationKey) {
  const weatherCastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}&language=en-us&details=true&metric=true`;
  const WeatherResponse = await fetch(weatherCastUrl);
  const WeatherData = await WeatherResponse.json();
  return WeatherData;
}

async function displayInfo() {
  const temp = document.getElementById("temperature");
  const dailyCast = document.querySelector(".dailyCast span");
  const locationName = document.querySelector(".location h2");
  const aqi = document.querySelector(".aqi h5");
  const description = document.getElementById("description");
  const dayHumidity = document.querySelector(".dailyCastIndex h2");
  const dayFeelsLike = document.querySelector(".dailyCastIndex h3");
  const dayUvIndex = document.querySelector(".dailyCastIndex h4");
  const wind = document.querySelector(".dailyCastIndex h5");
  const date = document.querySelector(".dailyCastIndex span");
  const screen = document.getElementById("screen").value;

  localStorage.setItem("location", screen);

  try {
    const locationKey = await getLocation(screen);
    const WeatherData = await weatherCast(locationKey);
    console.log(WeatherData);
    console.log(locationKey);
    // Display weather information
    dailyCast.innerHTML = `${WeatherData.DailyForecasts[0].Day.ShortPhrase}`;
    temp.innerHTML = ` ${WeatherData.DailyForecasts[0].Temperature.Maximum.Value.toFixed()}°C`;
    aqi.innerHTML = `${WeatherData.DailyForecasts[0].AirAndPollen[0].Category}`;
    description.innerHTML = `${WeatherData.Headline.Text}`;
    dayHumidity.innerHTML = `☔<br/>Humidity<br/>${WeatherData.DailyForecasts[0].Day.RelativeHumidity.Average}%`;
    dayFeelsLike.innerHTML = `🌡<br/>Feels like <br/>${WeatherData.DailyForecasts[0].RealFeelTemperature.Maximum.Value.toFixed()}°`;
    dayUvIndex.innerHTML = ` 🔆<br/>UV<br/>${WeatherData.DailyForecasts[0].AirAndPollen[5].Category} <br/>${WeatherData.DailyForecasts[0].AirAndPollen[5].Value}`;
    wind.innerHTML = ` ༄<br/>Wind<br/>${WeatherData.DailyForecasts[0].Day.Wind.Speed.Value}Km/h`;
    date.innerHTML = `${new Date().toLocaleDateString()}`;

    // Display location name
    locationName.innerHTML = `${screen}`.toUpperCase();
  } catch (err) {
    console.log("Got some error", err);
    // Display error message
    locationName.innerHTML = "Location not found";
    temp.innerHTML = "";
    dailyCast.innerHTML = "";
    aqi.innerHTML = "";
    description.innerHTML = "";
    dayHumidity.innerHTML = "";
    dayFeelsLike.innerHTML = "";
    dayUvIndex.innerHTML = "";
    wind.innerHTML = "";
    date.innerHTML = "";
  }
}

searchBtn.addEventListener("click", displayInfo);

window.onload = () => {
  const savedLocation = localStorage.getItem("location");
  if (savedLocation) {
    document.getElementById("screen").value = savedLocation;
  }
  displayInfo();
};
