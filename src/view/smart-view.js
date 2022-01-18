import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (update, justDataUpdating) => {
    if(!update) {
      console.log('!update');
      return;
    }

    console.log('--------------------------');
    console.log('Before ->', this._data);

    this._data = {...this._data, ...update};

    console.log('After ->', this._data);

    if (justDataUpdating) {
      console.log('justDataUpdating');
      return;
    }

    this.updateElement();
    console.log('this.updateElement()', this.updateElement());
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
