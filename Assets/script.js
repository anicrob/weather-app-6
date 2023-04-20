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
    console.log($(".section-city-btns").children.length);
    if($(".section-city-btns").children.length > 5){
        $(".section-city-btns").empty();
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
}
//event listener for the search button
$(".searchBtn").on("click", getAPI);
//call init() function on page refresh
init();