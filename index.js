const apiKey = "5f25ae49fadb5b229f95527975fc5d73";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const currentLocationBtn = document.querySelector('.current-location-btn');
async function getWeather(city){
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    const response = await fetch(apiUrl+city+`&appid=${apiKey}`);
    var data = await response.json();
    if(data.cod != 200){
        Swal.fire("please enter the city name properly!");
        getCurrentLocationData();
        return;

    }
    console.log(data);
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".weather-condition").innerHTML = data.weather[0].description;
    document.querySelector(".weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    getFiveDayForecast(city);
    getHourlyData(city);
   
}
async function getcurrentWeather(lat,lon){ 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const response = await fetch(url);
    var data = await response.json();
    if(data.cod != 200){
        Swal.fire("please enter the city name properly!");
        getCurrentLocationData();
        return;

    }
    console.log(data);
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".weather-condition").innerHTML = data.weather[0].description;
    document.querySelector(".weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    getFiveDayForecast(data.name);
    getHourlyData(data.name);
}
async function getHourlyData(city) {
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    let hourForecast = '';
    data.list.slice(0, 8).forEach(hour => {
        hourForecast += `
            <div class="row">
                <div class="data">
                    <p class="time">${hour.dt_txt.split(' ')[1]}</p>
                    <p class="temp">${hour.main.temp}°C</p>
                    <p class="weather-type">${hour.weather[0].description}</p>
                </div>
                <div class="icon">
                    <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="weather-icon" class="icons">
                </div>
            </div>
        `;
    });

    document.querySelector(".hourly-forecast").innerHTML = hourForecast;
})
.catch(error => {
    console.error('Error fetching hourly data:', error);
});
}



async function getFiveDayForecast(city){
const currentDayIndex = new Date().getDay();
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
let forecast = '';
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
data.list.forEach((day, index) => {
    if (index % 8 === 0) {
        const dayIndex = (currentDayIndex + index / 8) % 7;
        const dayOfWeek = daysOfWeek[dayIndex];
        forecast+= ` <div class="day">
            <p class="day-name">${dayOfWeek}</p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon" >
            <p class="weather-type">${day.weather[0].description}</p>
            <p class="temp-line">Temp</p>
            <p class="temp"> min : ${day.main.temp_min}°C </p>
            <p class="temp"> max : ${day.main.temp_max}°C </p>

        </div>`
    }
});
document.querySelector(".weather-forecast").innerHTML = forecast;
});
}



function getWeatherByLatLong(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getcurrentWeather(latitude,longitude);

}
function showError(error) {
switch(error.code) {
    case error.PERMISSION_DENIED:
    console.log("User denied the request for Geolocation.");
    break;
    case error.POSITION_UNAVAILABLE:
    console.log("Location information is unavailable.");
    break;
    case error.TIMEOUT:
    console.log("The request to get user location timed out.");
    break;
    case error.UNKNOWN_ERROR:
    console.log("An unknown error occurred.");
    break;
}
}

function getCurrentLocationData(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLatLong, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

}
function setTimeAndWish(){
    const currentHour = new Date().getHours();
    const wish = document.querySelector('.wish');
    const time = new Date().toLocaleTimeString();
    document.querySelector('.time').innerHTML = time;
        if (currentHour >= 5 && currentHour < 12) {
                 wish.innerHTML = "Good morning"
        } else if (currentHour >= 12 && currentHour < 18) {
                 wish.innerHTML = "Good afternoon"
        } else if (currentHour >= 18 && currentHour < 22) {
                wish.innerHTML = "Good evening"
        } else {
                wish.innerHTML = "Good night"
        }
}
currentLocationBtn.addEventListener("click",()=>{
    getCurrentLocationData();
})
searchBtn.addEventListener("click",()=>{
    getWeather(searchBox.value);
})
getCurrentLocationData();
setTimeAndWish();