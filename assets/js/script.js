// get city input
var getCity = function() {
    // get text value
    var cityName = $("#city-name").val();
    $("#city-name").val("");
    // check to see if input box is empty, if not send to geoCode()
    if (cityName) { 
        geoCode(cityName);
    } else {
        alert("Please Enter City Name");
        return;
    }
}

// convert city name to lon and lat
var geoCode = function(cityName) {
    var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=38e977330d53ed7f34446b8799f27821"
    // fetch api data for given location to convert to long and lat
    fetch(geoApi).then(function(response) {
        // request went through
        if (response.ok) {
            response.json().then(function(data) {
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                window.officialName = data[0].name
                console.log(data)
                // send vars to getData
                getData(latitude,longitude)
            });
        }
        // error with request
        else {
            alert("There was a problem with your request!");
        }
    });
}

// takes lon and lat and retrieves weather data
var getData = function(latitude,longitude) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=38e977330d53ed7f34446b8799f27821&units=imperial";
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
    // input current weather data into container
    var currentDate = moment().format('MM/DD/YYYY');
    $("#location-header").text(window.officialName + ' (' + currentDate + ')')
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


    // remove any child nodes if any to prevent clutter
    $("#weekly").empty();

    var forecastEl = $("#weekly");
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
        
        
        forecastEl.append(forecastCard);
        forecastCard.append(forecastDate, forecastTemp, forecastWind, forecastHum);
        
        nDays = nDays + 1;

        saveHistory(window.officialName);
    };
};

var saveHistory = function(cityName) {
    // check if city is already in storage
    var checkCity = false;
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage["city" + i] === cityName) {
            checkCity = true;
            break;
        }
    }
    if (checkCity === false) {
        // saves city to storage
        localStorage.setItem("city" + localStorage.length, cityName)
        displayHistory();
    }
}

var displayHistory = function() {
    $("#history").empty();
    var historyEl = $("#history");
    for (var i = 0; i < localStorage.length; i++) {

        var text = localStorage.getItem("city" + i)
        var buttonHistory = $("<button>")
            .addClass("btn text-center w-100 mb-3")
            .attr("id", "history-btn")
            .text(text);
            historyEl.append(buttonHistory);
    }
}

var test = function() {
    console.log(this.value)
}

// event listener for input
$("#search").on('click', function() {
    getCity();
});

// event listener for history buttons
$("#history").on('click', function(e) {
    var text = $(e.target).text().trim();
    geoCode(text);
})

displayHistory();

console.log(localStorage.getItem("city0"))

