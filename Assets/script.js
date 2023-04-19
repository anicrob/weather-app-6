var apiKey = "0de6000030553e472206e763ef224694";
var city;
var cityLon;
var cityLat;
var cityList;

function init(){
    cityList = localStorage.getItem("city");
    console.log(typeof(cityList));
    if (cityList){
        cityList = JSON.parse(cityList);
        for (var i=0; i<cityList.length; + i++){
           var newBtn = $("<button class='mt-4 lh-lg cityBtn d-block rounded border-0' data-index='i'>" + cityList[i] + "</button>")
           $(".section-city-btns").append(newBtn);
        }
    } else {
        cityList = [];
    }
}
function getAPI(event){
    event.preventDefault();
    city = $(".city-input-box").val();
    cityList = cityList.push(city);
    localStorage.setItem("city", JSON.stringify(cityList));
    init();
    console.log(city);

    var todayRequestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial"
    console.log(todayRequestURL);

    fetch(todayRequestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Use the console to examine the response
            console.log(data);
            $("#today-temperature").text(data.main.temp + "° F");
            $("#today-wind").text(data.wind.speed + " MPH speed");
            $("#today-humidity").text(data.main.humidity + "%");
            cityLon = data.coord.lon;
            cityLat = data.coord.lat;
        });
        console.log(data.coord.lon, data.coord.lat);
        var fivedayRequestURL = "api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon="+ cityLon + "&appid=" + apiKey;
            fetch(fivedayRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // Use the console to examine the response
                    console.log(data);   
                });        
    }

$(".searchBtn").on("click", getAPI);
init();