//Global Variables
let tempSymbol = `c`;
const APIKEY = "key=366f2d81c4a443b4ac0134520251703";
const BASEURL = "https://api.weatherapi.com/v1/";
let data;

//NavBar Elements
const navbarDiv = document.querySelector(".search-bar-group");
const navbarInput = document.querySelector(".nav-bar-search-box");

//Search Bar Animation
navbarInput.addEventListener("focus", () => {
  navbarDiv.style.flex = 0.98;
});

navbarInput.addEventListener("blur", () => {
  let text = navbarInput.value;
  if(text !== "") fetchCurrentWeather(text);
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
  });
}

//Live Clock for Current Location
window.addEventListener("load", () => {
  clock();
  fetchCurrentWeather("auto:ip");
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
    const time = `${hourTime}:${minute}:${second}${ampm}`;

    document.querySelector("#day-details").innerHTML = weekdayList[weekday];
    document.querySelector("#date-details").innerHTML = date;
    document.querySelector("#time-details").innerHTML = time;
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
const fetchCurrentWeather = async (location) => {
  let URL = `${BASEURL}current.json?${APIKEY}&q=${location}`;
  let response = await fetch(URL);
  data = await response.json();

  currentTempChanges();
};

// Current Grid Changes
const currentTempChanges = () => {
  let city = data.location.name;
  let country = data.location.country;
  document.querySelector(
    "#location-details-text"
  ).innerText = `${city}, ${country}`;

  let currTemp = data.current[`temp_${tempSymbol}`];
  let expectedTemp = data.current[`heatindex_${tempSymbol}`];
  document.querySelector(
    "#current-temperature"
  ).innerHTML = `${currTemp}&deg;${tempSymbol.toUpperCase()}`;
  document.querySelector(
    "#expected-temperature"
  ).innerHTML = `/${expectedTemp}&deg;${tempSymbol.toUpperCase()}`;

  let condition = data.current.condition.text;
  let feel = data.current[`feelslike_${tempSymbol}`];

  document.querySelector("#current-location-atmosphere-details").innerText =
    condition;
  document.querySelector(
    "#current-location-expected-details"
  ).innerHTML = `Feels like ${feel}&deg;${tempSymbol.toUpperCase()}`;
  iconChange(data.current.condition.code,data.current.is_day);
};

// Icon Changes in Current Weather
const iconChange = async (conditionCode, isDay) => {
  let url;
  let response = await fetch(`https://www.weatherapi.com/docs/weather_conditions.json`);
  let conditionData = await response.json();
  
  conditionData.forEach(condition => {
    if(conditionCode === condition.code){
      isDay === 1 ? url=`Icons/DayIcons/${condition.day}.png` : url=`Icons/NightIcons/${condition.night}.png`;
    }
  });
  document.querySelector(".middle-atmosphere-icon-box").style.backgroundImage = `url('${url}')`;
};


