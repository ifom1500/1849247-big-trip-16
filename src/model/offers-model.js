
export default class OffersModel {
  #offers = new Map();
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  getByType = () => this.#offers;

  init = async () => {
    try {
      const allOffers = await this.#apiService.offers;
      allOffers.forEach(({ type, offers }) => {
        this.#offers.set(type, offers);
      });
    } catch(err) {
      this.#offers = [];
    }
  }
}
