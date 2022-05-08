var apiKey = "32e5b77b2df8ec37489dff7810741eca"
var cityName = "greenwich"
// var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial&ctn=5";
var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=32e5b77b2df8ec37489dff7810741eca"

// convert city name to lon and lat
var geoCode = function() {
    // fetch api data for given location to convert to long and lat
    fetch(geoApi).then(function(response) {
        // request went through
        if (response.ok) {
            response.json().then(function(data) {
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                
                // send vars to getData
                getData(latitude,longitude)
            });
        }
        // error with request
        else {
            console.log("There was a problem with your request!");
        }
    });
}

// takes lon and lat and retrieves weather data
var getData = function(latitude,longitude) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=32e5b77b2df8ec37489dff7810741eca&units=imperial";
    // fetch api data for to get weather data
    fetch(apiUrl).then(function(response) {
        // request went through
        if (response.ok) {
            response.json().then(function(data) {
                forecast(data);
            });
        }
        // error with request
        else {
            console.log("There was a problem with your request!");
        }
    });
}


var forecast = function(data) {
    console.log(data);
    // $("#location-header").text(data.city.name)

}

geoCode();
// getData();
