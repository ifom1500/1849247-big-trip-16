export const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const PointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

export const POINT_TYPES = Object.values(PointType);

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
  CANCEL_ADD_POINT: 'CANCEL_ADD_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
  NONE: 'NONE',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const NavigationItem = {
  TABLE: 'table',
  STATS: 'stats',
};

export const ESCAPE_KEYS = ['Escape', 'Esc'];

export  const PointMessage = {
  LOADING: 'Loading...',
  CREATE_POINT: 'Click New Event to create your first point',
  NO_PAST_EVENTS: 'There are no past events now',
  NO_FUTURE_EVENTS: 'There are no future events now',
};
