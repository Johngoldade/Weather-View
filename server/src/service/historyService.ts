import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// TODO: Define a City class with name and id properties
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
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return fs.readFileSync('db/searchHistory.json', 'utf8')
  }
  // // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const cityList = JSON.stringify(cities, null, 2)
    fs.writeFile('db/searchHistory.json', cityList, (err) =>
        err ? console.error(err) : console.log('Success!'))
  }
  // // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    let cityArray: City[] = []
    try {
      cityArray = [].concat(JSON.parse(cities));
      
    } catch (err) {
      // cityArray = [];
    }
    return cityArray;

    
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const name = city
    console.log(`This route works with ${name}!`)

    const newCity = new City(
      city,
      uuidv4()
    )

    return await this.getCities()
      .then((cities) => {
        return [...cities, newCity];
      })
      .then((updatedArray) => this.write(updatedArray))
      .then(() => newCity);
  }
    
  // // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  
}

export default new HistoryService();
