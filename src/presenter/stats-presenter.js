import StatisticsView from '../view/statistics-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { formatPointDuration } from '../utils/date.js';
import { getStats, getMoneyData, getTimeData, getTypeData } from '../utils/stats.js';

const formatMoneyChart = (value) => `€ ${value}`;
const formatTypeChart =  (value) => `${value}x`;

export default class StatsPresenter {
  #containerElement = null;
  #pointsModel = null;
  #statisticsComponent = null;

  constructor(containerElement, pointsModel) {
    this.#containerElement = containerElement;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const stats = getStats(this.#pointsModel.points);

    const charts = [
      { id: 'money', text: 'MONEY', formatter: formatMoneyChart, ...getMoneyData(stats) },
      { id: 'type', text: 'TYPE', formatter: formatTypeChart, ...getTypeData(stats) },
      { id: 'time', text: 'TIME', formatter: formatPointDuration,...getTimeData(stats) },
    ];

    const prevStatisticsComponent = this.#statisticsComponent;

    this.#statisticsComponent = new StatisticsView(charts);

    if (prevStatisticsComponent === null) {
      render(this.#containerElement, this.#statisticsComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this.#statisticsComponent, prevStatisticsComponent);
    remove(prevStatisticsComponent);
  }

  destroy = () => {
    remove(this.#statisticsComponent);
    this.#statisticsComponent = null;

    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
