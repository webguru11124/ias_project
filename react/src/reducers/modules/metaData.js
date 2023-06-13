const initState = {};

const metaData = (state = initState, action) => {
  switch (action.type) {
    case 'set_MetaData':
      state.data = action.content;
      break;
    default:
      break;
  }
  return { ...state };
};

export default metaData;
