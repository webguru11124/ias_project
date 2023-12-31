import store from '../reducers';

const makeFormBody = (details) => {
  let formBody = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  return formBody;
};

export const getImageByUrl = async function (folderName, imgName) {
  try {
    const state = store.getState();

    // console.log(folderName);

    let response = await fetch(folderName, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        Authorization: state.auth.tokenType + ' ' + state.auth.token,
      },
    });
    let blob = await response.blob();

    // console.log(blob);

    let file = new File([blob], folderName, { type: blob.type });

    file.path = folderName;
    return file;
  } catch (err) {
    //console.log(err);
    return null;
  }
};

export const getImagesByNames = async function (imgNames) {
  const state = store.getState();
  try {
    const promises = imgNames.map(async (imgName) => {
      const params = {
        merge_req_body: imgName,
      };
      const options = {
        method: 'POST',
        body: makeFormBody(params),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: state.auth.tokenType + ' ' + state.auth.token,
        },
      };
      let response = await fetch(
        process.env.REACT_APP_BASE_API_URL + 'image/tile/get_image_by_path',
        options,
      );
      let blob = await response.blob();
      var filename = imgName.substring(imgName.lastIndexOf('/') + 1);

      let file = new File([blob], filename, { type: 'image/tiff' });
      file.path = filename;
      return file;
    });
    return Promise.all(promises);
  } catch (err) {
    return null;
  }
};

export const getMergedImage = async function (
  fileNames,
  newImageName,
  callback,
) {
  const state = store.getState();
  const params = {
    merge_req_body: fileNames.join(',') + '&' + newImageName,
  };
  const options = {
    method: 'POST',
    body: makeFormBody(params),
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: state.auth.tokenType + ' ' + state.auth.token,
    },
  };

  fetch(
    process.env.REACT_APP_BASE_API_URL + 'image/tile/get_merged_image',
    options,
  )
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json().then((data) => {
          if (data.error) {
            alert(data.error);
          }
          callback(true);
        });
      } else {
        return response.blob();
      }
    })
    .then((blob) => {
      let file = new File([blob], newImageName, { type: 'image/tiff' });
      file.path = newImageName;
      callback(null, file);
    })
    .catch((_err) => callback(true));
};
