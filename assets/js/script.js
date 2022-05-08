var cityName = "Greenwich"

// convert city name to lon and lat
var geoCode = function(cityName) {
    var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=32e5b77b2df8ec37489dff7810741eca"
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
    var apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=32e5b77b2df8ec37489dff7810741eca&units=imperial";
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
    // input current weather data into container
    var currentDate = moment().format('MM/DD/YYYY');
    $("#location-header").text(cityName + ' (' + currentDate + ')')
    $("#temp").text(data.current.temp + "\u00B0F")
    $("#wind").text(data.current.wind_speed + " MPH")
    $("#humidity").text(data.current.humidity + "%")

    // uv index has different background based on value
    $("#uv").removeClass(uvStatus);
    var uv = data.current.uvi;
    $("#uv").text(uv)
    if (uv < 3) {
        var uvStatus = "low";
    } else if (uv < 6) {
        var uvStatus = "moderate";
    } else if (uv < 8) {
        var uvStatus = "high";
    } else if (uv < 11) {
        var uvStatus = "very-high";
    } else {
        var uvStatus = "extreme";
    };
    $("#uv").addClass(uvStatus);


    // create card for weather forecast and loop to next day
    var nDays = 1
    for (var i = 0; i < 5; i++) {
        // creates container with date as header
        var forecastCard = $("<div>")
        .addClass("bg-secondary text-light col-2 p-2");

        var forecastDate = $("<h5>")
        .addClass("mb-4")
        .text(moment().add(nDays, 'days').format('MM/DD/YYYY'));
        // creates and places data inside container
        var forecastTemp = $("<p>")
        .addClass("mt-2 text-wrap")
        .text('Temp: ' + data.daily[i].temp.day + "\u00B0F");

        var forecastWind = $("<p>")
        .addClass("mt-2 text-wrap")
        .text("Wind: " + data.daily[i].wind_speed + "MPH");

        var forecastHum = $("<p>")
        .addClass("mt-2 text-wrap")
        .text("Humidity: " + data.daily[i].humidity + "%");
        
        
        $("#weekly").append(forecastCard);
        $(forecastCard).append(forecastDate, forecastTemp, forecastWind, forecastHum);
        
        nDays = nDays + 1;
    };


};

geoCode(cityName);
