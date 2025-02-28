import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Define the City class 
class City {
  name: string;
  id: string;

  constructor (
    name: string, 
    id: string
  ) {
    this.name = name
    this.id = id
  }
}
// Define the HistoryService class
class HistoryService {

  //Define a read method
  private async read() {
    try {
      return fs.readFileSync('db/searchHistory.json', 'utf8')
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  // Define a write method
  private async write(cities: City[]) {
    const cityList = JSON.stringify(cities, null, 2)
    fs.writeFile('db/searchHistory.json', cityList, (err) =>
        err ? console.error(err) : console.log('Success!'))
  }

  // Define a getCities method to get the cities
  async getCities() {

    const cities = await this.read();
    let cityArray: City[] = []
    try {
      // Code was reccomended by CoPilot
      cityArray = [].concat(JSON.parse(cities));
      return cityArray;
    } catch (error) {
      console.error(error)
      return cityArray = []
    }
  }

  // Define an addCity method 
  async addCity(city: string) {

    const newCity = new City(
      city,
      uuidv4()
    )

    return await this.getCities()
      .then((cities) => {
        // Code was reccomended by CoPilot
        return [...cities, newCity];
      })
      .then((updatedArray) => this.write(updatedArray))
      .then(() => newCity);
  }
    
  // Define a removeCity method 
  async removeCity(id: string) {

    const cityList = await this.getCities();
    for (let i = 0; i < cityList.length; i++) {
      // Code was reccomended by CoPilot
      if (cityList[i].id === id) {
        cityList.splice(i, 1);
        break;
      }
    }
    await this.write(cityList);
    return cityList;
  }
  
}

export default new HistoryService();
