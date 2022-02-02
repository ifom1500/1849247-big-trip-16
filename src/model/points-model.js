import AbstractObservable from '../utils/abstract-observable.js';
import { UpdateType } from '../utils/const.js';
import { parseDate } from '../utils/date.js';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #data = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return [...this.#data];
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#data = points.map(this.#adaptToClient);
    } catch(err) {
      this.#data = [];
    }

    this._notify(UpdateType.INIT);
  }

  update = async (updateType, update) => {
    const index = this.#data.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(this.#adaptToServer(update));
      const updatedPoint = this.#adaptToClient(response);

      this.#data = [
        ...this.#data.slice(0, index),
        updatedPoint,
        ...this.#data.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  add = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(this.#adaptToServer(update));
      const newPoint = this.#adaptToClient(response);
      this.#data = [...this.#data, newPoint];

      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add new point]');
    }
  }

  delete = async (updateType, update) => {
    const index = this.#data.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(update);
      this.#data = [
        ...this.#data.slice(0, index),
        ...this.#data.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete this trip event');
    }
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: parseDate(point['date_from']),
      dateTo: parseDate(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
