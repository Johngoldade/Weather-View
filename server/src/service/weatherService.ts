import dotenv from 'dotenv';
dotenv.config();

// Define the Coordinates interface
interface Coordinates {
  latitude: number,
  longitude: number
}
// Define the Weather class
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor (
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city
    this.date = date
    this.icon = icon
    this.iconDescription = iconDescription
    this.tempF = tempF
    this.windSpeed = windSpeed
    this.humidity = humidity
  }
}
// Define the WeatherService class
class WeatherService {

  // getWeatherForCity method
  async getWeatherForCity(city: string) {
    const baseURL = process.env.API_BASE_URL
    const APIKey = process.env.API_KEY
    const cityName = city
    // Build the geocode URL and return the json file
    const geocodeURL = `${baseURL}/geo/1.0/direct?q=${cityName},USA&limit=1&appid=${APIKey}`
    const coorInfo = await fetch(geocodeURL).then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching geocode data: ${response.statusText}`);
      } else {
        console.log('Location geocoded')
        return response.json();
      }
    })
  
    // Build the location coordinates
    const coordinates: Coordinates = {
      latitude: coorInfo[0].lat,
      longitude: coorInfo[0].lon
    }

    // Get current weather
    const weatherURL = `${baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${APIKey}&units=imperial`
    const currentWeather = await fetch(weatherURL).then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching current weather data: ${response.statusText}`);
      } else {
        console.log('Current weather found')
        return response.json();
      }
    })
  
    // Build current weather object
    const current = new Weather (
      cityName,
      new Date(currentWeather.dt * 1000).toLocaleDateString(),
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.wind.speed,
      currentWeather.main.humidity
    )

    // Get forecasted weather
    const forecastURL = `${baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${APIKey}&units=imperial`
    const futureWeather = await fetch(forecastURL).then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching forecasted weather data: ${response.statusText}`);
      } else {
        console.log('Forecasted weather found')
        return response.json();
      }
    })
    
    // Build weather array with current and forecasted objects
    let forecastArray = [current]
    for (let i = 0; i < futureWeather.list.length; i += 8) {
    const forecast = new Weather(
        cityName,
        new Date(futureWeather.list[i].dt * 1000).toLocaleDateString(),
        futureWeather.list[i].weather[0].icon,
        futureWeather.list[i].weather[0].description,
        futureWeather.list[i].main.temp,
        futureWeather.list[i].wind.speed,
        futureWeather.list[i].main.humidity
        )
        forecastArray.push(forecast)
      }

    
    return forecastArray
  }
}

export default new WeatherService();
