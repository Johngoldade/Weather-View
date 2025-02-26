import dotenv from 'dotenv';
// import { response } from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number,
  longitude: number
}
// TODO: Define a class for the Weather object
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
// TODO: Complete the WeatherService class
class WeatherService {

  async getWeatherForCity(city: string) {
    const baseURL = process.env.API_BASE_URL
    const APIKey = process.env.API_KEY
    const cityName = city
    const geocodeURL = `${baseURL}/geo/1.0/direct?q=${cityName},USA&limit=1&appid=${APIKey}`
    const coorInfo = await fetch(geocodeURL).then((response) => response.json())
    // if (!coorInfoResponse.ok) {
    //   throw new Error(`Error fetching geocode data: ${coorInfoResponse.statusText}`);
    // }
  
    const coordinates: Coordinates = {
      latitude: coorInfo[0].lat,
      longitude: coorInfo[0].lon
    }

    const weatherURL = `${baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${APIKey}&units=imperial`
    console.log(weatherURL)
    const currentWeather = await fetch(weatherURL).then((response) => response.json())
  
    const current = new Weather (
      cityName,
      new Date(currentWeather.dt * 1000).toLocaleDateString(),
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.wind.speed,
      currentWeather.main.humidity
    )

    const forecastURL = `${baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${APIKey}&units=imperial`
    console.log(forecastURL)
    const futureWeather = await fetch(forecastURL).then((response) => response.json())
    
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
