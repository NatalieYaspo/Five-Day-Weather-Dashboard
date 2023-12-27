var apiKey = config.openWthr;
var searchFormEl = document.getElementById('citySearchInput');
var cityName = document.querySelector('.city-name');
var currentTempDisp = document.getElementById('temp-00');
var currentWindDisp = document.getElementById('wind-00');
var currentHumidDisp = document.getElementById('humidity-00');
var currentWeatherIcon = document.getElementById('weatherIcon-00');
var searchDisplayEl = document.getElementById('pastSearches');


//Date
var today = dayjs().format('MM-DD-YYYY');

//Collect Data from Seach Box:
function handleSearchFormSubmit(event) {
    event.preventDefault();
    // console.log('clicked!') //works!

    var searchInputVal = document.getElementById('search-input').value;
    // console.log('search-input value: ' + searchInputVal); //works!

    localStorage.setItem('searchCity', JSON.stringify(searchInputVal));

    if (!searchInputVal) {
        console.log('You need to enter a City Name!'); //works!
        return;
    }

    //Set City Display name & current date
    cityName.textContent = searchInputVal + " " + today; //works!
    setDates();

    //Converts user entry of City Name to GeoCode with Latitude & Longitude for location.
    var queryGeoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInputVal + '&limit=1&appid=' + apiKey;
    //console.log('returning geoCode for search input? ' + queryGeoCode); //pull link from API.

    fetch(queryGeoCode)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log('show data:', data); //works, shows object with all items
            for (var i = 0; i < data.length; i++) {
                // console.log('show latitude: ' + data[i].lat); //works!
                let searchLat = data[i].lat
                // console.log('show longitude: ' + data[i].lon); //works!
                let searchLon = data[i].lon

        //Store Latitude and Longitude to Local Storage
                localStorage.setItem('searchLat', searchLat);
                localStorage.setItem('searchLon', searchLon);
            }

            getCityWeather();
            getFiveDayForecast();
            createSearchButton();
        })
    
        resetSearchInput();
}
 
//Resets search input
function resetSearchInput() {  
    $('#search-input').val("");
}

//Create new buttons for past searches: //NEED TO TEST
function createSearchButton() {

    //get searches from local storage
    var searches = readSearchesFromStorage().slice(1, -1);
    // console.log("still showing? ", searches); //works!

    //create button for each search
    var buttonEl = document.createElement('button');

    //append elements to DOM to display them
    buttonEl.textContent = searches;
    searchDisplayEl.appendChild(buttonEl);
}

//Read past searches from local storage //NEED TO TEST
function readSearchesFromStorage() {
    var searches = localStorage.getItem('searchCity');
    //console.log("should show recent city searched: " + searches); //works!
    return searches;
}


// Searches for current weather based on Lat and Lon:
function getCityWeather() {
    var searchStoredLat = localStorage.getItem('searchLat');
    // console.log(searchStoredLat); //works!
    var searchStoredLon = localStorage.getItem('searchLon');
    // console.log(searchStoredLon); //works!
    var searchCurrentWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + searchStoredLat + '&lon=' + searchStoredLon + '&appid=' + apiKey + '&units=imperial';
    // console.log(searchCurrentWeather); //works!

    fetch (searchCurrentWeather)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log('show new data', data);
            let icon = data.weather[0].icon
            // console.log('icon for current temp? ' + icon); //code is showing
            let temp = data.main.temp
            // console.log('temp for current temp? ' + temp); //working!
            let humidity = data.main.humidity
            // console.log('humidity for current temp? ' + humidity); //working!
            let wind = data.wind.speed
            // console.log('wind for current temp? ' + wind);//working!

            //Have new Data appear on screen:
            currentWeatherIcon.src = 'http://openweathermap.org/img/w/' + icon + '.png';
            currentTempDisp.textContent = "Temperature: " + temp + " degrees F";
            currentWindDisp.textContent = "Wind Speed: " + wind + " MPH";
            currentHumidDisp.textContent = "Humidity: " + humidity + "%";
    })
}


//Pulls 5-Day forecast
function getFiveDayForecast() {
    var searchStoredLat = localStorage.getItem('searchLat');
    var searchStoredLon = localStorage.getItem('searchLon');
    var searchFiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + searchStoredLat + '&lon=' + searchStoredLon + '&appid=' + apiKey + '&units=imperial';
    // console.log("pulling api: " + searchFiveDayForecast); //works!

    fetch (searchFiveDayForecast)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            // console.log("how does the 5-day data display: ", data.list); //THIS is what I want.
            let dataArr = data.list

            //Day-01 - I am sure there is a different way to do all of this, but this is the only way I can make it work.
            var icon01El = document.getElementById('weatherIcon-01');
            var temp01El = document.getElementById('temp-01');
            var wind01El = document.getElementById('wind-01');
            var humidity01El = document.getElementById('humidity-01');
            //Day-01 collecting the data
            var icon01 = dataArr[0].weather[0].icon
            var temp01 = dataArr[0].main.temp
            var wind01 = dataArr[0].wind.speed
            var humidity01 = dataArr[0].main.humidity
            //Day-01 how it will appear on screen
            icon01El.src = 'http://openweathermap.org/img/w/' + icon01 + '.png';
            temp01El.textContent = "Temperature: " + temp01 + " degrees F";
            wind01El.textContent = "Wind Speed: " + wind01 + " MPH";
            humidity01El.textContent = "Humidity: " + humidity01 + "%";

            //Day-02
            var icon02El = document.getElementById('weatherIcon-02');
            var temp02El = document.getElementById('temp-02');
            var wind02El = document.getElementById('wind-02');
            var humidity02El = document.getElementById('humidity-02');
            //Day-02 collecting the data
            var icon02 = dataArr[8].weather[0].icon
            var temp02 = dataArr[8].main.temp
            var wind02 = dataArr[8].wind.speed
            var humidity02 = dataArr[8].main.humidity
            //Day-02 how it will appear on screen
            icon02El.src = 'http://openweathermap.org/img/w/' + icon02 + '.png';
            temp02El.textContent = "Temperature: " + temp02 + " degrees F";
            wind02El.textContent = "Wind Speed: " + wind02 + " MPH";
            humidity02El.textContent = "Humidity: " + humidity02 + "%";

            //Day-03
            var icon03El = document.getElementById('weatherIcon-03');
            var temp03El = document.getElementById('temp-03');
            var wind03El = document.getElementById('wind-03');
            var humidity03El = document.getElementById('humidity-03');
            //Day-03 collecting the data
            var icon03 = dataArr[16].weather[0].icon
            var temp03 = dataArr[16].main.temp
            var wind03 = dataArr[16].wind.speed
            var humidity03 = dataArr[16].main.humidity
            //Day-03 how it will appear on screen
            icon03El.src = 'http://openweathermap.org/img/w/' + icon03 + '.png';
            temp03El.textContent = "Temperature: " + temp03 + " degrees F";
            wind03El.textContent = "Wind Speed: " + wind03 + " MPH";
            humidity03El.textContent = "Humidity: " + humidity03 + "%";

            //Day-04
            var icon04El = document.getElementById('weatherIcon-04');
            var temp04El = document.getElementById('temp-04');
            var wind04El = document.getElementById('wind-04');
            var humidity04El = document.getElementById('humidity-04');
            //Day-04 collecting the data
            var icon04 = dataArr[24].weather[0].icon
            var temp04 = dataArr[24].main.temp
            var wind04 = dataArr[24].wind.speed
            var humidity04 = dataArr[24].main.humidity
            //Day-04 how it will appear on screen
            icon04El.src = 'http://openweathermap.org/img/w/' + icon04 + '.png';
            temp04El.textContent = "Temperature: " + temp04 + " degrees F";
            wind04El.textContent = "Wind Speed: " + wind04 + " MPH";
            humidity04El.textContent = "Humidity: " + humidity04 + "%";

            //Day-05
            var icon05El = document.getElementById('weatherIcon-05');
            var temp05El = document.getElementById('temp-05');
            var wind05El = document.getElementById('wind-05');
            var humidity05El = document.getElementById('humidity-05');
            //Day-05 collecting the data
            var icon05 = dataArr[32].weather[0].icon
            var temp05 = dataArr[32].main.temp
            var wind05 = dataArr[32].wind.speed
            var humidity05 = dataArr[32].main.humidity
            //Day-05 how it will appear on screen
            icon05El.src = 'http://openweathermap.org/img/w/' + icon05 + '.png';
            temp05El.textContent = "Temperature: " + temp05 + " degrees F";
            wind05El.textContent = "Wind Speed: " + wind05 + " MPH";
            humidity05El.textContent = "Humidity: " + humidity05 + "%";
        })
}


//Have dates increase by 1 for each card.
function setDates() {
    var day01 = dayjs().add(1, 'day').format('MM-DD-YYYY')
    var day02 = dayjs().add(2, 'day').format('MM-DD-YYYY')
    var day03 = dayjs().add(3, 'day').format('MM-DD-YYYY')
    var day04 = dayjs().add(4, 'day').format('MM-DD-YYYY')
    var day05 = dayjs().add(5, 'day').format('MM-DD-YYYY')
    $('#date-01').text(day01);
    $('#date-02').text(day02);
    $('#date-03').text(day03);
    $('#date-04').text(day04);
    $('#date-05').text(day05);
}

function handleReSearchFormSubmit(event) {
    event.preventDefault();
    //finds which button was selected
    var reSearchCity = event.target.textContent
    // console.log(reSearchCity);
    localStorage.setItem('searchCity', reSearchCity);

    //Set City Display name & current date
    cityName.textContent = reSearchCity + " " + today; //works!
    setDates();

    //Converts user entry of City Name to GeoCode with Latitude & Longitude for location.
    var queryGeoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + reSearchCity + '&limit=1&appid=' + apiKey;
    console.log('returning geoCode for search input? ' + queryGeoCode); //pull link from API.

    fetch(queryGeoCode)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log('show data:', data); //works, shows object with all items
            for (var i = 0; i < data.length; i++) {
                // console.log('show latitude: ' + data[i].lat); //works!
                let searchLat = data[i].lat
                // console.log('show longitude: ' + data[i].lon); //works!
                let searchLon = data[i].lon

        //Store Latitude and Longitude to Local Storage
                localStorage.setItem('searchLat', searchLat);
                localStorage.setItem('searchLon', searchLon);
            }
            getCityWeather();
            getFiveDayForecast();
        })
}
   

//Event Listener for 'Search" button
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
searchDisplayEl.addEventListener('click', handleReSearchFormSubmit); //NEED TO WORK THIS OUT ONCE BUTTONS APPEAR