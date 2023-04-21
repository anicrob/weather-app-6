//variables declared
var apiKey = "0de6000030553e472206e763ef224694";
var city;
var cityLon;
var cityLat;
var cityList;
//on page refresh
function init(){
    //get city from local storage
    cityList = localStorage.getItem("city");
    // console.log(typeof(cityList));
    //if it exists
    if (cityList){
        //parse it
        cityList = JSON.parse(cityList);
        //create a button per item
        for (var i=0; i<cityList.length; + i++){
           var newBtn = $("<button class='mt-4 lh-lg cityBtn d-block rounded border-0' data-index=" +i + ">" + cityList[i] + "</button>")
           //append the button to the buton section
           $(".section-city-btns").append(newBtn);
        }
    //else (it's empty), set it to an empty array
    } else {
        cityList = [];
    }
    //if there's 5 or more cities, clear local storage - this is so there's never more than 5 buttons
    if(cityList.length >= 5){
        localStorage.clear();
    }
}
//gets API data
function getAPI(event){
    //preventing the default
    event.preventDefault();
    //empty the five-day-forecast-section
    $(".five-day-forecast-section").empty();
    //set the city to the value inputted
    city = $(".city-input-box").val();
    //push that value into the cityList array
    cityList.push(city);
    //turn it into a string and set it to local storage
    localStorage.setItem("city", JSON.stringify(cityList));
    // console.log(city);
//define the request URL for the today info
    var todayRequestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial"
    // console.log(todayRequestURL);
//fetch the today URL
    fetch(todayRequestURL)
        .then(function (response) {
            //turn it into JSON
            return response.json();
        })
        .then(function (data) {
            // Use the console to examine the response
            console.log(data);
            //set the today dashboard info
            $("#today-temperature").text(data.main.temp + "° F");
            $("#today-wind").text(data.wind.speed + " MPH");
            $("#today-humidity").text(data.main.humidity + "%");
            $("#city-name").text(data.name);
            $("#today-date").text(new Date().toLocaleDateString());
            //how to set the image
            var iconURL= data.weather[0].icon
            $(".weather-emoji").attr("src","http://openweathermap.org/img/w/" + iconURL + ".png");
            //grab the coordinates to use in the next fetch
            cityLon = data.coord.lon;
            cityLat = data.coord.lat;
            //define the fivedayRequestURL variable
             var fivedayRequestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLon + "&appid=" + apiKey + "&units=imperial";            
             //fetch it
             fetch(fivedayRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // Use the console to examine the response
                    // console.log(data);  
                    //filter the data to only provide 5 days at 15:00:00
                    const eveningDataValue= data.list.filter(function(currentDay){
                        return currentDay.dt_txt.endsWith("15:00:00")
                    })
                    //use console to examine new responses
                    console.log(eveningDataValue);
                    //for each list item (day/time timestamp), create weather tiles, with the proper data
                    for (var i=0; i< eveningDataValue.length; i++){
                        //first get the date and make it the proper format
                        var getDate = eveningDataValue[i].dt_txt.split(' ')[0]
                        var tempDate = new Date(getDate);
                        var properFormattedCurrentDate = [tempDate.getMonth() + 1, tempDate.getDate() + 1, tempDate.getFullYear()].join('/');
                        //this is for the weather icon
                        var iconURL = eveningDataValue[i].weather[0].icon
                        // console.log(iconURL);
                        //create weather tiles
                        var weatherTile = $(
                            "<div class='weathertile border'>" +
                            "<p class='text-white fs-3'>" + properFormattedCurrentDate + "</p>" +
                            `<img alt='weather icon' class='day-icon' src="http://openweathermap.org/img/w/${iconURL}.png">` +
                            "<p class='ms-2 text-white'>" + "Temp:" + eveningDataValue[i].main.temp + "° F" + "</p>" +
                            "<p class='ms-2 text-white'>" + "Wind:" + eveningDataValue[i].wind.speed + " MPH" + "</p>" +
                            "<p class='ms-2 text-white'>" + "Humidity:" + eveningDataValue[i].main.humidity + "%" + "</p>" +
                            "</div>")
                        console.log(eveningDataValue[i]);
                        console.log('>>>>>>>>>>', iconURL);
                        console.log('>>>> click here: ', "http://openweathermap.org/img/w/" + iconURL + ".png")
                        console.log("icon chosen:>>>>>", $(".day-icon"))
                    //append the tiles to the tile section
                    $(".five-day-forecast-section").append(weatherTile);
                    }

                }) 
                
            })
}
$(".section-city-btns").on("click",".cityBtn",function(){
    //empty the five-day-forecast-section
    $(".five-day-forecast-section").empty();
    //set the city to the button's value/text   
    city = $(this).text();
//define the request URL for the today info
    var todayRequestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial"
    // console.log(todayRequestURL);
    //fetch the today URL
    fetch(todayRequestURL)
        .then(function (response) {
            //turn it into JSON
            return response.json();
        })
        .then(function (data) {
            // Use the console to examine the response
            console.log(data);
            //set the today dashboard info
            $("#today-temperature").text(data.main.temp + "° F");
            $("#today-wind").text(data.wind.speed + " MPH");
            $("#today-humidity").text(data.main.humidity + "%");
            $("#city-name").text(data.name);
            $("#today-date").text(new Date().toLocaleDateString());
            //how to set the image
            var iconURL= data.weather[0].icon
            $(".weather-emoji").attr("src","http://openweathermap.org/img/w/" + iconURL + ".png");
            //grab the coordinates to use in the next fetch
            cityLon = data.coord.lon;
            cityLat = data.coord.lat;
            //define the fivedayRequestURL variable
             var fivedayRequestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLon + "&appid=" + apiKey + "&units=imperial";            
             //fetch it
             fetch(fivedayRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // Use the console to examine the response
                    console.log(data);  
                    //filter the data to only provide 5 days at 15:00:00
                    const eveningDataValue= data.list.filter(function(currentDay){
                        return currentDay.dt_txt.endsWith("15:00:00")
                    })
                    //use console to examine new responses
                    console.log(eveningDataValue);
                    //for each list item (day/time timestamp), create weather tiles, with the proper data
                    for (var i=0; i< eveningDataValue.length; i++){
                        //first get the date and make it the proper format
                        var getDate = eveningDataValue[i].dt_txt.split(' ')[0]
                        var tempDate = new Date(getDate);
                        var properFormattedCurrentDate = [tempDate.getMonth() + 1, tempDate.getDate() + 1, tempDate.getFullYear()].join('/');
                        //create weather tiles
                        var weatherTile = $(
                            "<div class='weathertile border'>" +
                            "<p class='text-white fs-3'>" + properFormattedCurrentDate + "</p>" +
                            "<img alt='weather icon' class='day-icon'>" +
                            "<p class='ms-2 text-white'>" + "Temp:" + eveningDataValue[i].main.temp + "° F" + "</p>" +
                            "<p class='ms-2 text-white'>" + "Wind:" + eveningDataValue[i].wind.speed + " MPH" + "</p>" +
                            "<p class='ms-2 text-white'>" + "Humidity:" + eveningDataValue[i].main.humidity + "%" + "</p>" +
                            "</div>")
                        //this is for the weather icon
                        var iconURL = eveningDataValue[i].weather[0].icon
                        $(".day-icon").attr("src", "http://openweathermap.org/img/w/" + iconURL + ".png");
                    //append the tiles to the tile section
                    $(".five-day-forecast-section").append(weatherTile);
                    }

                }) 
                
            })
})
//event listener for the search button
$(".searchBtn").on("click", getAPI);
//call init() function on page refresh
init();
//one function with the city name - invoke second function
//another one for lat and long for weather tiles 5 day forecast

//init - gets local storage history to render it - needs to be a separate function
//also need to render when you click on search - like a new search - append

//function renderSearchHistory() {
//     searchHistoryContainer.innerHTML = '';

//     // Start at end of history array and count down to show the most recent at the top.
//     for (var i = searchHistory.length - 1; i >= 0; i--) {
//       var btn = document.createElement('button');
//       btn.setAttribute('type', 'button');
//       btn.setAttribute('aria-controls', 'today forecast');
//       btn.classList.add('history-btn', 'btn-history');
  
//       // `data-search` allows access to city name when click handler is invoked
//       btn.setAttribute('data-search', searchHistory[i]);
//       btn.textContent = searchHistory[i];
//       searchHistoryContainer.append(btn);
//     }
//   }
// function appendToHistory(search) {
//     // If there is no search term return the function
//     if (searchHistory.indexOf(search) !== -1) {
//       return;
//     }
//     searchHistory.push(search);
  
//     localStorage.setItem('search-history', JSON.stringify(searchHistory));
//     renderSearchHistory();
//   }
//   function initSearchHistory() {
//     var storedHistory = localStorage.getItem('search-history');
//     if (storedHistory) {
//       searchHistory = JSON.parse(storedHistory);
//     }
//     renderSearchHistory();
//   }

// searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);

//   function handleSearchHistoryClick(e) {
//     // Don't do search if current elements is not a search history button
//     if (!e.target.matches('.btn-history')) {
//       return;
//     }
  
//     var btn = e.target;
//     var search = btn.getAttribute('data-search');
//     fetchCoords(search);
//   }

