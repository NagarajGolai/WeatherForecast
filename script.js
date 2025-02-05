document.addEventListener("DOMContentLoaded", () => {
  const ctName = document.getElementById("inputCity");
  let ctSpan = document.getElementById("citySpan");
  const wtSpan = document.getElementById("spanHead");
  const containerDiv = document.getElementById("container");
  const CtoF = document.getElementById("convButton");
  const dnSpan = document.getElementById("daynightSpan");
  let timespan = document.getElementById("timeSpan");
  let city, currentCity, tempC, tempF, imageUrl;
  const imageChanger = document.getElementById("imgContainer");
  const outP = document.getElementById("outerP");
  
  let cond;
  const bgImgs = ["weather-graphics/b1.jpg","weather-graphics/b2.jpg","weather-graphics/b3.jpg","weather-graphics/b4.jpg","weather-graphics/b5.jpg","weather-graphics/b6.jpg"]

  // window.alert("Turn your location ON!");
  const apiKey = "8d6cb43408b94bc5b63170410250302";

  let choice = Math.floor(Math.random() * bgImgs.length)
  let randImg = bgImgs[choice]
  document.getElementById("bodyDiv").style.backgroundImage = `url("${randImg}")`;

  document.getElementById('xIcon').addEventListener('click', ()=>{
    outP.style.display = 'none';
  })

  // Position Fetching
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.location) {
        currentCity = data.location.name;
        console.log(`You are in: ${currentCity}`);
        wtSpan.style.display = "block";
        ctSpan.innerHTML = currentCity;
        containerDiv.style.backgroundColor = "rgba(0, 0, 0, 0.542)";
        CtoF.innerHTML = "Show in °F";
        getWeather(currentCity);
      } else {
        console.log("City not found");
        ctSpan.innerHTML = "Oops! can't fetch your current city!"
      }
    } catch (error) {
      console.error("Error fetching current city:", error);
      ctSpan.innerHTML = "Oops! can't fetch your current city!"
    }
  });

  // Enter Button working
  ctName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      ctName.value.trim() === ""
        ? (city = "Enter a correct name!")
        : (city = ctName.value);
      wtSpan.style.display = "block";

      containerDiv.style.backgroundColor = "rgba(0, 0, 0, 0.532)";
      ctSpan.innerHTML = city;
      CtoF.innerHTML = "Show in °F";

      getWeather(city);
    }
  });

  //Display the time
  function displayTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    timespan.innerHTML = `${hours} : ${minutes} : ${seconds}`;

    if (hours > 5 && hours < 12) {
      dnSpan.innerHTML = "Good Morning";
    } else if (hours > 12 && hours < 16) {
      dnSpan.innerHTML = "Good Afernoon";
    } else if (hours > 16 && hours < 19) {
      dnSpan.innerHTML = "Good Evening";
    } 
    else if(hours > 19 && hours < 24 || hours < 5){
      dnSpan.innerHTML = "Night";
    }
    else {
      dnSpan.innerHTML = "";
    }
  }
  setInterval(displayTime, 1000);
  displayTime();

  // Conversion of celsius to farhenheit
  CtoF.addEventListener("click", () => {
    if (CtoF.innerHTML === "Show in °F") {
      document.getElementById("tempSpan").innerHTML = `${tempF} °F`;
      CtoF.innerHTML = "Show in °C";
    } else {
      document.getElementById("tempSpan").innerHTML = `${tempC} °C`;
      CtoF.innerHTML = "Show in °F";
    }
  });

  //WeatherAPI start

  async function getWeather(city1) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city1}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      tempC = data.current.temp_c;
      tempF = data.current.temp_f;
      const humidity = data.current.humidity;
      const windSpeed = data.current.wind_kph;
      const condition = data.current.condition.text;
      cond = condition;

      if (cond.toLowerCase() === "Partly Cloudy".toLowerCase()) {
        imageChanger.style.backgroundImage =
          'url("./weather-graphics/PartlyCloudyPic.jpg")';
      }
      else if(cond.toLowerCase() === "Sunny".toLowerCase()){
        imageChanger.style.backgroundImage = 'url("weather-graphics/SunnyPic.jpg")';
      }
      else if(cond.toLowerCase() === "Overcast".toLowerCase()){
        imageChanger.style.backgroundImage = 'url("weather-graphics/CloudyPic.jpg")';
      }
      else if(cond.toLowerCase() === "Mist".toLowerCase()){
        imageChanger.style.backgroundImage = 'url("weather-graphics/mistPic.jpg")';
      }
      else if(cond.toLowerCase() === "Clear".toLowerCase()){
        imageChanger.style.backgroundImage = 'url("weather-graphics/SunnyPic.jpg")';
      }
      else if(cond.toLowerCase().includes("Light Rain".toLowerCase())){
        imageChanger.style.backgroundImage = 'url("weather-graphics/RainyPic.jpg")';
        containerDiv.style.backgroundColor = "rgba(0, 0, 0, 0.68)";
      }

      // Display of weather conditions
      document.getElementById("condSpanText").innerHTML = "Weather condition";
      document.getElementById("condSpan").innerHTML = condition;
      document.getElementById("tempSpan").innerHTML = `${tempC} °C`;
      document.getElementById("tempSpanText").innerHTML = "Temperature";
      document.getElementById("humSpan").innerHTML = `${humidity}%`;
      document.getElementById("humSpanText").innerHTML = "Humidity";
      document.getElementById("windSpan").innerHTML = `${windSpeed} km/h`;
      document.getElementById("windSpanText").innerHTML = "Wind Speed";

    } catch (error) {
      console.error("Last Error fetching weather:", error);
      ctSpan.innerHTML = "Enter a correct City Name"
    }
  }
});

// Sunny, clear, overcast, pc, mist
