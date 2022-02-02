export default class DestinationsModel {
  #destinations = new Map();
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get = () => {
    const destinations = [...this.#destinations.values()];
    return destinations;
  }

  getByName = (name) => this.#destinations.get(name);

  init = async () => {
    try {
      const destinations = await this.#apiService.destinations;
      destinations.forEach((destination) => {
        this.#destinations.set(destination.name, destination);
      });
    } catch(err) {
      this.#destinations = [];
    }
  }
}
