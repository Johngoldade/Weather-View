import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName = req.body.cityName;
  if (cityName) {
    try {
      // TODO: GET weather data from city name
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      console.log(weatherData);
      // TODO: save city to search history
      await HistoryService.addCity(cityName);
      res.json(weatherData);
    } catch (error) {
      res.status(500).send('Error getting weather');
    }
  } else {
    res.status(400).send('City name is required');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    res.status(500).send('Error retrieving history');
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await HistoryService.removeCity(id);
    res.status(200).send('City deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting city.');
  }
});

export default router;

