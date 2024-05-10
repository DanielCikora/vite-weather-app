import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudRain,
  faSnowflake,
  faCloud,
  faBolt,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function WeatherBox() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const UNITS = "metric";

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  useEffect(() => {
    const fetchWeatherByLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
          const reverseGeocodingResponse = await axios.get(reverseGeocodingUrl);
          let cityName = reverseGeocodingResponse.data[0].name;
          if (cityName.includes(" City")) {
            cityName = cityName.split(" City")[0];
          }
          setCity(cityName);
          setSelectedCity(cityName);
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${UNITS}`;
          const weatherResponse = await axios.get(weatherUrl);
          setWeatherData(weatherResponse.data);
        });
      } catch (error) {
        console.error("Error fetching weather data by location:", error);
      }
    };

    fetchWeatherByLocation();
  }, []);
  const handleSetCity = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${UNITS}`
      );
      setWeatherData(response.data);
      setSelectedCity(city);
    } catch (error) {
      console.error("Error fetching weather data!", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSetCity();
    }
  };
  const weatherIcons = {
    Clear: faSun,
    Rain: faCloudRain,
    Snow: faSnowflake,
    Clouds: faCloud,
    Thunderstorm: faBolt,
    Drizzle: faCloudRain,
    Wind: faWind,
  };
  return (
    <>
      <div className='input-box'>
        <input
          name='city-input'
          className='input-box__input'
          type='text'
          value={city.toUpperCase()}
          placeholder='Search city...'
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className='input-box__button' onClick={handleSetCity}>
          Set City
        </button>
      </div>
      <div className='weather-box'>
        <h2 className='title weather-title__h2'>
          Weather in {selectedCity.toUpperCase()}
        </h2>
        {weatherData && (
          <div>
            <p className='paragraph weather-paragraph'>
              Temperature: {Math.round(weatherData.main.temp)}°C
            </p>
            <p className='paragraph weather-paragraph'>
              Humidity: {weatherData.main.humidity}%
            </p>
            <p className='paragraph weather-paragraph'>
              Weather Condition: {weatherData.weather[0].main}
            </p>
            <i className='weather-icon'>
              <FontAwesomeIcon
                icon={weatherIcons[weatherData.weather[0].main]}
              />
            </i>
          </div>
        )}
      </div>
    </>
  );
}
