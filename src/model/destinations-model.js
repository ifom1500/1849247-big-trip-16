export default class DestinationsModel {
  #destinations = new Map();

  set = (destinations) => {
    destinations.forEach((destination) =>
      this.#destinations.set(destination.name, destination));
  }

  get = () => [...this.#destinations.values()]; // [{description}, {name}, {pics}, ...]

  getByName = (name) => this.#destinations.get(name);
}
