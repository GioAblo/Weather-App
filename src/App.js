import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [city, setCity] = useState("Tbilisi");
  const [weatherData, setWeatherData] = useState(null);
  const [cityImage, setCityImage] = useState();

  const [notFoundCity, setNotFoundCity] = useState(null);



  const data = async() => {
      try {
        
        const apiKey = "9b24a891b5431d7a71dd8201b9e6812b";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
        const response = await axios.get(apiUrl);
        setWeatherData(response.data);
        

      } catch (error) {
        console.error( "fetching data", error);
        setWeatherData(null);
        setNotFoundCity("Sorry city not found");
        setCity(null)
      }
  }

  const cityImageData = async() => {
    try {
        const unsplashApiKey = 'eR3yNG6gibyyZSQ6hGN3ThlPG9__XP94PCHxHqOK2y0';
        const unsplashApi = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashApiKey}`;

        const image = await axios.get(unsplashApi);
        setCityImage(image.data.urls.regular);
        
    } catch (error) {
      console.error(error);
      setCityImage(null);
    }
  }

  useEffect(() => {
    cityImageData();

    data();
    setCity("");
    setNotFoundCity(null)
  }, []);

  const handleSearch = () => {
      // Trigger a new API request when the search button is clicked
      data();
      cityImageData();
      setCity("");
    };


  const convertKelvinToCelsius = (kelvin) => {
    return kelvin - 273.15
  }

  const convertMPSToKMH = (speedMetersPerSec) => {
    return (speedMetersPerSec * 3.6).toFixed()
  }

  const subtractLastTwoDigits = (value) => {
    // Use modulo 100 to get the last two digits
    return value % 100;
  };


  
  

  return (
    <div className="App">
      <div>
        <input type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {weatherData && 
      <div>
        <img src={cityImage} alt='city' style={{width: "200px", height: "200px", borderRadius: "50%"}} />
        <h2>CITY:  {weatherData.name}</h2>
        <h3>{weatherData.weather[0].main}</h3>
        <h4>{weatherData.weather[0].description}</h4>
        <p>Temperature: {convertKelvinToCelsius(weatherData.main.temp).toFixed()} °C</p> 
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Pressure: {subtractLastTwoDigits(weatherData.main.pressure)}%</p>
        <p>Wind: { convertMPSToKMH(weatherData.wind.speed)} km/h</p>  
      </div>
      }
      </div>
       <div style={{color: "red"}}>
        {city == null && notFoundCity}
       </div>
      
    </div>
  );
}

export default App;
