const DEFAULT_PARAMS = {
  anaylsis_method: '',
  learning_method: '',
  object_method: '',
  method_info: '',

  // view Data
  vessel_data: {
    id: 1,
    type: 'Slide',
    count: 1,
    title: 'Single',
  },
  objective_data: null,
  channel_data: null,
  image_adjust_data: null,
  zposition: null,
  timeline: null,
};

const initState = {
  ...DEFAULT_PARAMS,
};

const measure = (state = initState, action) => {
  switch (action.type) {
    case 'set_measure_data':
      return {
        ...state,
        ...action.payload,
      };
    case 'update_measure_vessel_data':
      return {
        ...state,
        vessel_data: {
          ...state.vessel_data,
          ...action.payload,
        },
      };
    case 'update_measure_objective_data':
      return {
        ...state,
        vessel_data: action.payload,
        // vessel_data: {
        //     ...state.objective_data,
        //     ...action.payload,
        // }
      };
    case 'update_measure_channel_data':
      return {
        ...state,
        vessel_data: {
          ...state.channel_data,
          ...action.payload,
        },
      };
    case 'update_measure_image_adjust_data':
      return {
        ...state,
        vessel_data: {
          ...state.image_adjust_data,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default measure;
