import { parseDate } from './date.js';

// Default Settings для точки
// Набросок для дефолтных значений новой точки
// Оставил моковый массив destinations, чтобы увидеть отображаются ли картинки
export const DEFAULT_POINT = {
  basePrice: 10,
  dateFrom: parseDate(),
  dateTo: parseDate(),
  destination: {
    description: 'Your description',
    name: 'Your destination',
    pictures: [
      {
        description: 'picture Racсoon 1',
        src: 'http://picsum.photos/248/152?r=1',
      },
      {
        description: 'picture Racсoon 2',
        src: 'http://picsum.photos/248/152?r=2',
      },
      {
        description: 'picture Racсoon 3',
        src: 'http://picsum.photos/248/152?r=3',
      },
      {
        description: 'picture Racсoon 4',
        src: 'http://picsum.photos/248/152?r=4',
      }
    ],
  },
  id: '0',
  isFavorite: false,
  type: 'bus',
  offers: [
    {type: 'bus', offers: [{ id: 1, title: 'Video guide', price: 100 }]}
  ],
};

export const Mode = {
  CREATE_MODE: true,
  EDIT_MODE: false,
};

export const POINT_COUNT = 3;
