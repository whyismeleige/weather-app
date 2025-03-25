//Global Variables
let tempSymbol = `c`;
const WeatherAPIKEY = "key=366f2d81c4a443b4ac0134520251703";
const BASEURL = "https://api.weatherapi.com/v1/";
const CountryAPIKEY = "eFZSMDhRY2RXUFk1Z3d2TkRGZjdjdklFelRMNmJqYWt1Z2NkQ29VSw==";
let weatherData;
let citiesData;
let country;
let FORECAST = "d";

//NavBar Elements
const navbarDiv = document.querySelector(".search-bar-group");
const navbarInput = document.querySelector(".nav-bar-search-box");

//Search Bar Animation
navbarInput.addEventListener("focus", () => {
  navbarDiv.style.flex = 0.98;
});

navbarInput.addEventListener("blur", () => {
  let text = navbarInput.value;
  if(text !== "") fetchCurrentWeather(text,"14");
  // Search Bar Weather Changes
  navbarDiv.style.flex = "";
  navbarInput.value = "";
});

//Current Location Drop Down
const tempDropdown = document.querySelector(".temp-dropdown-content").children;
const tempDropdownBtn = document.querySelector(".temp-dropdown-btn");
const dropdownIcon = document.querySelector("#dropdown-icon");

for (let i = 0; i <= tempDropdown.length - 1; i++) {
  let text = tempDropdown[i].innerText;
  let value = tempDropdown[i].getAttribute("data-value");
  tempDropdown[i].addEventListener("click", () => {
    tempDropdownBtn.innerText = `${text}`;
    tempDropdownBtn.append(dropdownIcon);
    tempSymbol = value;
    currentTempChanges();
    changeHighlights();
  });
}

//Time DropDown Changes
const timeDropdownItems = document.querySelectorAll(".time-dropdown-item");
timeDropdownItems.forEach((element) => {
  element.addEventListener("click", () => {
    FORECAST = element.dataset.value;
    changeForecast();
  });
});

//Live Clock for Current Location
window.addEventListener("load", () => {
  // Horizontal Scrolling of Forecast Menu
  const scrollContainer = document.querySelector(".lower-forecast-details-container");

  scrollContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY;
  });

  // Clock and Fetching
  clock();
  fetchCurrentWeather("auto:ip","14");
  function clock() {
    const today = new Date();

    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    const hour = hours < 10 ? "0" + hours : hours;
    const minute = minutes < 10 ? "0" + minutes : minutes;
    const second = seconds < 10 ? "0" + seconds : seconds;

    const hourTime = hour > 12 ? hour - 12 : hour;

    const ampm = hour < 12 ? "AM" : "PM";

    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDate();
    const weekday = today.getDay();

    const weekdayList = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = `${monthList[month]} ${day}, ${year}`;
    const time = `${hourTime}:${minute}:${second} ${ampm}`;
    const highlightsTime = `${hourTime}:${minute} ${ampm}`;

    document.querySelector("#day-details").innerHTML = weekdayList[weekday];
    document.querySelector("#date-details").innerHTML = date;
    document.querySelector("#time-details").innerHTML = time;
    document.querySelector("#visibility-details").innerHTML = highlightsTime;
    document.querySelector("#wind-extra-details").innerHTML = highlightsTime;

    setTimeout(clock, 1000);
  }
});

//Adding Countries to Country Dropdown
const countryDropdown = document.querySelector(".country-dropdown-content");

for (const [key, value] of Object.entries(countrylist)) {
  let element = document.createElement("div");
  let img = document.createElement("img");
  let text = document.createElement("span");

  img.className = "country-dropdown-item-flag";
  text.className = "country-dropdown-item-text";
  element.className = "country-dropdown-item";

  img.src = `https://flagsapi.com/${value}/shiny/32.png`;
  text.innerText = key;
  element.setAttribute("data-value", key);

  element.append(img);
  element.append(text);
  countryDropdown.append(element);
}

countryDropdown.scroll({
  top: countryDropdown.scrollHeight,
  behavior: "smooth",
});

// Finding Weather Details
const fetchCurrentWeather = async (location,days) => {
  let URL = `${BASEURL}forecast.json?${WeatherAPIKEY}&q=${location}&aqi=yes&days=${days}`;
  try {
    const response = await fetch(URL);
    if (!response.ok){
      throw new Error(`HTTPS error! Status: ${response.status}`);
    }
    weatherData = await response.json();
    console.log(`Weather Data received for ${weatherData.location.name}`);

  } catch (error) {
    console.log(`Error Retrieving Weather Data for "${location}"`,error);
  }
  country = weatherData.location.country;
  currentTempChanges();
  changeHighlights();
  changeForecast();
  getCitiesData(countrylist[weatherData.location.country]);
};

// Current Grid Changes
const currentTempChanges = () => {
  let city = weatherData.location.name;
  country = weatherData.location.country;
  document.querySelector(
    "#location-details-text"
  ).innerText = `${city}, ${country}`;


  let currTemp = weatherData.current[`temp_${tempSymbol}`];
  let expectedHighTemp = weatherData.forecast.forecastday[0].day[`maxtemp_${tempSymbol}`];
  let expectedLowTemp = weatherData.forecast.forecastday[0].day[`mintemp_${tempSymbol}`];

  document.querySelector(
    "#current-temperature"
  ).innerHTML = `${currTemp}&deg;${tempSymbol.toUpperCase()}`;
  document.querySelector(
    "#expected-temperature"
  ).innerHTML = `${expectedHighTemp}&deg/${expectedLowTemp}&deg;${tempSymbol.toUpperCase()}`;

  let condition = weatherData.current.condition.text;
  let feel = weatherData.current[`feelslike_${tempSymbol}`];

  document.querySelector("#current-location-atmosphere-details").innerText =
    condition;
  document.querySelector(
    "#current-location-expected-details"
  ).innerHTML = `Feels like ${feel}&deg;${tempSymbol.toUpperCase()}`;
  iconChange(weatherData.current.condition.code,weatherData.current.is_day,document.querySelector(".middle-atmosphere-icon-box"));
};

// Icon Changes in Current Weather
const iconChange = async (conditionCode, isDay,element) => {
  let url;
  let response = await fetch(`https://www.weatherapi.com/docs/weather_conditions.json`);
  let conditionData = await response.json();
  
  conditionData.forEach(condition => {
    if(conditionCode === condition.code){
      isDay === 1 ? url=`Icons/DayIcons/${condition.day}.png` : url=`Icons/NightIcons/${condition.night}.png`;
    }
  });
  if(element.nodeName === "IMG") element.src = url;
  else element.style.backgroundImage = `url('${url}')`;
};

const IconChange = async (conditionCode,element) => {
  let url;
  let response = await fetch(`https://www.weatherapi.com/docs/weather_conditions.json`);
  let conditionData = await response.json();
  
  conditionData.forEach(condition => {
    if(conditionCode === condition.code){
      url=`Icons/DayIcons/${condition.day}.png`;
    }
  });
  if(element.nodeName === "IMG") element.src = url;
  else element.style.backgroundImage = `url('${url}')`;
};

//Highlights Changes
const changeHighlights = () => {
  let humidity = parseInt(weatherData.current.humidity,10);
  let uvIdx = parseInt(weatherData.current.uv,10);
  document.querySelector("#wind-status-main-detail").innerText = weatherData.current.wind_kph;
  document.querySelector("#humidity-main-detail").innerText = humidity;
  document.querySelector("#visibility-main-detail").innerText = weatherData.current.vis_km;
  document.querySelector("#uv-index-main-detail").innerText = uvIdx;
  document.querySelector("#title-text").innerText = `Today's ${weatherData.location.name} Highlights`; 

  document.querySelector("#sunrise-time").innerText = weatherData.forecast.forecastday[0].astro.sunrise;
  document.querySelector("#sunset-time").innerText = weatherData.forecast.forecastday[0].astro.sunset;

  let conditionHumid = document.querySelector("#humidity-details");
  let conditionUV = document.querySelector("#uv-index-extra-details");

  if(humidity <= 40) conditionHumid.innerText = `Humidity is low`;
  else if(humidity >= 60) conditionHumid.innerText = `Humidity is high`;
  else conditionHumid.innerText = `Humidity is good`;

  if(uvIdx >= 1 && uvIdx <= 2) conditionUV.innerText = `Low UV`;
  else if(uvIdx >= 3 && uvIdx <= 5) conditionUV.innerText = `Moderate UV`;
  else if(uvIdx >= 6 && uvIdx <= 7) conditionUV.innerText = `High UV`;
  else if(uvIdx >= 8 && uvIdx <= 10) conditionUV.innerText = `Very High UV`;
  else conditionUV.innerText = `Extreme UV`;
}

//Getting Cities Data
const getCitiesData = async (countryCode) => {
  try{
    let headers = new Headers();
    headers.append("X-CSCAPI-KEY",CountryAPIKEY);

    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/cities`,requestOptions);

    if(!response.ok){
      throw new Error(`HTTPS Error! Status: ${response.status}, Error in fetching city list for Country Code: ${countryCode}`);
    }

    citiesData = await response.json();
    console.log(`City Data Received for Country Code: ${countryCode}`);

    fetchEachCityData();

  }catch(error){
    console.log(`Error in Fetching City Data for ${countryCode}`,error);
  }
}

//Fetching Each City Data
const fetchEachCityData = () => {
  document.querySelector(".lower-container").replaceChildren();
  document.querySelector("#other-cities-title").innerText = `Other Cities in ${country}`;
  citiesData.forEach( async (city) => {
    let cityName = city.name;
    let URL = `${BASEURL}forecast.json?${WeatherAPIKEY}&q=${cityName}&aqi=yes`;
    try{
      let response = await fetch(URL);
      if(!response.ok){
        throw new Error(`Unable to fetch weather data for city ${cityName}, Status : ${response.status}`); 
      }
      let cityData = await response.json();
      if(cityData.location.country !== country) throw new Error(`Incorrect City`);
      addCityWidgets(cityData);
    }catch(error){
      console.error(error);
    }
  });
}

//Adding Each City to The Div
const addCityWidgets =  (cityData) => {
  let widget = document.createElement("div");
  widget.className = "cities-widgets";

  let cityDetails = document.createElement("div");
  let countryName = document.createElement("span");
  let cityName = document.createElement("span");
  let weatherDetails = document.createElement("span");

  cityDetails.className = "cities-details";
  countryName.className = "country-name";
  cityName.className = "city-name";
  weatherDetails.className = "weather-detail";

  let cityAtmosphere = document.createElement("img");
  cityAtmosphere.className = "city-atmosphere";

  let cityTemperature = document.createElement("div");
  let cityCurrTemp = document.createElement("span");
  let cityMinTemp = document.createElement("span");

  cityTemperature.className = "city-temperature";
  cityCurrTemp.className = "city-current-temperature-detail";
  cityMinTemp.className = "city-min-temperature-detail";

  countryName.innerText = cityData.location.country;
  cityName.innerText = cityData.location.name;
  weatherDetails.innerText = cityData.current.condition.text;

  iconChange(cityData.current.condition.code,cityData.current.is_day,cityAtmosphere);

  cityCurrTemp.innerHTML = `${cityData.current[`temp_${tempSymbol}`]}&deg;`;
  cityMinTemp.innerHTML = `/${cityData.forecast.forecastday[0].day[`mintemp_${tempSymbol}`]}&deg;`;

  cityDetails.append(countryName,cityName,weatherDetails);
  cityTemperature.append(cityCurrTemp,cityMinTemp);

  widget.append(cityDetails,cityAtmosphere,cityTemperature);

  document.querySelector(".lower-container").append(widget);
}

//Country Dropdown Event Listener
const countriesList = document.querySelectorAll(".country-dropdown-item");

countriesList.forEach((element) => {
  element.addEventListener("click",() => {
    country = element.dataset.value;
    fetchCurrentWeather(element.dataset.value,14);
  });
});

//Changing Forecast
const changeForecast = () => {
  let lowerContainer = document.querySelector(".lower-forecast-details-container");
  lowerContainer.replaceChildren();
  if(FORECAST === "h"){
    document.querySelector("#forecast-title").innerText =  `24 Hours Forecast`;
    console.log("hours is being changed");
    for(let i=0;i<24;i++){
      let widget = document.createElement("div");
      let time = document.createElement("span");
      let img = document.createElement("img");
      let temp = document.createElement("span");

      widget.className = "forecast-widgets";
      time.className = "forecast-date";
      img.className = "forecast-icon";
      temp.className = "forecast-temp";

      time.innerText = `${weatherData.forecast.forecastday[0].hour[i].time.substring(11)}`;
      iconChange(weatherData.forecast.forecastday[0].hour[i].condition.code,weatherData.forecast.forecastday[0].hour[i].is_day,img);
      temp.innerHTML = `${weatherData.forecast.forecastday[0].hour[i][`temp_${tempSymbol}`]}&deg;`;

      widget.append(time,img,temp);
      lowerContainer.append(widget);
    }
  }else{
    document.querySelector("#forecast-title").innerText =  `14 Days Forecast`;
    console.log("days is being changed");
    for(let i=0;i<14;i++){

      let widget = document.createElement("div");
      let time = document.createElement("span");
      let img = document.createElement("img");
      let temp = document.createElement("span");

      widget.className = "forecast-widgets";
      time.className = "forecast-date";
      img.className = "forecast-icon";
      temp.className = "forecast-temp";
      
      time.innerText = `${weatherData.forecast.forecastday[i].date}`;
      IconChange(weatherData.forecast.forecastday[i].day.condition.code,img);
      temp.innerHTML = `${weatherData.forecast.forecastday[i].day[`maxtemp_${tempSymbol}`]}&deg;`;

      widget.append(time,img,temp);
      lowerContainer.append(widget);
    }
  }
}

