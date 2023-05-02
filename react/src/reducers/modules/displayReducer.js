const DEFAULT_PARAMS = {
  col: null,
  row: null,
  series: null,
  time: null,
  field: null,
  channel: null,
  z: null,
  dimensionOrder: null,
  sizeX: null,
  sizeY: null,
  sizeZ: null,
  sizeC: null,
  sizeT: null,
  type: null,
  id: null,
};

const initState = {
  ...DEFAULT_PARAMS,
};

//action redux
const display = (state = initState, action) => {
  switch (action.type) {
    case 'displayOptions':
      state = action.content;
      break;
    default:
      break;
  }
  return { ...state };
};

export default display;
