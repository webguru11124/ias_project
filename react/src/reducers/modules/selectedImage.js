const initState = {
  orginalFileName: '',
  url: '',
  xmlUrl: '',
  metadataMap: {},
  error: null,
};

const selectedImage = (state = initState, action) => {
  switch (action.type) {
    case 'set_SelectedImage':
      state.xmlUrl = action.content.xmlUrl;
      state.url = action.content.url;
      state.orginalFileName = action.content.orginalFileName;
      state.metadataMap = action.content.metadataMap;
      break;
    case 'set_MetaData':
      state.metadataMap = action.content;
      break;
    default:
      break;
  }
  return { ...state };
};

export default selectedImage;
