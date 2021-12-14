import { parseDate } from '../utils/date.js';

const POINT_TYPES = [
  'bus',
  'check-in',
  'drive',
  'flight',
  'restaurant',
  'ship',
  'sightseeing',
  'taxi',
  'train',
  'transport',
];

const OFFER_TITLES = [
  // taxi
  'Upgrade to a business class',
  'Choose the radio station',
  'Choose temperature',
  'Drive quickly, I\'m in a hurry',
  'Drive slowly',

  // bus
  'Infotainment system',
  'Order meal',
  'Choose seats',

  // restaurant
  'Choose live music',
  'Choose VIP area',

  // train
  'Book a taxi at the arrival point',
  'Order a breakfast',
  'Wake up at a certain time',
];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// DESTINATION
const generateDestination = (
  {
    description = 'Racсoon description',
    name = 'Racсoon City',
  } = {}) => (
  {
    description,
    name,
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racсoon 1'
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racсoon 2'
      },
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
        description: 'picture Racсoon 3'
      }
    ]
  });

export const destinations = [
  generateDestination(),
  generateDestination({ name: 'Moscow', description: 'Moscow description' }),
  generateDestination({ name: 'Hogvarts', description: 'Hogvarts description' }),
];

// OFFERS

const getRandomArrayItem = (items) => items[getRandomInteger(0, items.length - 1)];

const generatePoorId = () => +String(Math.random()).slice(-5);

const generateOffer = (
  {
    id = generatePoorId(),
    title = getRandomArrayItem(OFFER_TITLES),
    price = getRandomInteger(10, 100),
  } = {}) => ({
  id,
  title,
  price,
});

// Имитация массива с сервера
const allOffers = (
  [
    {
      type: 'bus',
      offers: [
        ...Array.from({ length: 2 }, generateOffer),
        generateOffer({ id: 1, title: 'Video guide', price: 100 }),
      ],
    },
    {
      type: 'check-in',
      offers: [
        ...Array.from({ length: 2 }, generateOffer),
        generateOffer({ id: 1, title: 'Wi-Fi', price: 100 }),
      ],
    },
    {
      type: 'drive',
      offers: [
        ...Array.from({ length: 2 }, generateOffer),
        generateOffer({ id: 1, title: 'Pet transport', price: 100 }),
      ],
    },
    {
      type: 'train',
      offers: [
        ...Array.from({ length: 2 }, generateOffer),
        generateOffer({ id: 1, title: 'Anakom', price: 100 }),
      ],
    },
  ]
);

// Функция адаптер: объект-словарь
export const AllOffersMap = allOffers.reduce((map, item) => {
  map[item.type] = item.offers;
  return map;
}, {});

// TRIP POINTS
const generateTripPoint = (
  {
    dateFromString,
    dateToString
  } ={}) => (
  {
    basePrice: getRandomInteger(20, 200),
    dateFrom: parseDate(dateFromString),
    dateTo: parseDate(dateToString),
    destination: destinations[0],
    id: '0',
    isFavorite: Boolean(getRandomInteger(0, 1)),
    type: 'bus',
    offers: [
      generateOffer({ id: 1, title: 'Wi-Fi', price: 100 }),
    ],
  }
);

export const tripPoints = [
  generateTripPoint(
    {
      dateFromString: '2019-07-10T22:55:56.845Z',
      dateToString: '2019-07-11T11:22:13.375Z',
    }
  ),
  generateTripPoint(
    {
      dateFromString: '2019-07-11T11:22:13.375Z',
      dateToString: '2019-07-11T17:54:22.854Z',
    }
  ),
  generateTripPoint(
    {
      dateFromString: '2019-07-11T17:54:22.854Z',
      dateToString: '2019-07-13T08:03:00.375Z',
    }
  ),
];
