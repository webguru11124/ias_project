import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import { Row, Col, Button, Image, Form } from 'react-bootstrap';
import * as authApi from '@/api/auth';
import store from '@/reducers';
import { isNull } from 'lodash';
import * as api_experiment from '@/api/experiment';
import { getImageUrl } from '@/helpers/file';

const LockScreen = () => {
  const DialogLockFlag = useFlagsStore((store) => store.DialogLockFlag);
  const [title, setTitle] = React.useState('');
  const isMLAdvance = useFlagsStore((store) => store.IsMLAdvance);
  const [password, setPassword] = React.useState('');
  const state = store.getState();
  const [selectedMethod, setSelectedMethod] = React.useState(
    state.experiment.method,
  );

  const close = () => {
    // useFlagsStore.setState({ DialogLockFlag: false });
  };

  const handleInput = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordInput = async () => {
    let result = await authApi.confirm_password(password);
    if (result.data.success === 'NO') {
      alert('Wrong Password');
      return;
    }
    useFlagsStore.setState({ DialogLockFlag: false });

    if (isMLAdvance) {
      useFlagsStore.setState({ IsMLAdvance: false });
      if (selectedMethod === 'cyto') {
        useFlagsStore.setState({ MLDialogICTSelectFlag: true });
      } else if (selectedMethod === 'ipscAdvance') {
        useFlagsStore.setState({ DialogLoadingFlag: true });
        let fullPath = state.files.imagePathForAvivator;
        let subPath = /path=(.*)/.exec(fullPath)[1];
        let imgPath = subPath.split('/').slice(1).join('/');

        let _payload = {
          original_image_url: imgPath,
        };
        store.dispatch({
          type: 'UPDATE_ML_MEASURE_PARAMS',
          payload: {
            method: 'iPS-TR',
          },
        });
        let res = await api_experiment.MLIPSProcessImage(_payload);
        // console.log('ICT-result:', res);
        _payload = {
          image_path: res.image_path,
        };
        res = await api_experiment.MLConvertResult(_payload);
        // console.log('ICT-convert-result:', res);
        useFlagsStore.setState({ DialogLoadingFlag: false });
        let source = getImageUrl(res.image_path, false, true);
        let source1 = getImageUrl(res.image_count_path, false, true);
        store.dispatch({ type: 'set_image_path_for_result', content: source });
        store.dispatch({
          type: 'set_image_path_for_count_result',
          content: source1,
        });
        store.dispatch({
          type: 'set_csv_path_for_result',
          content: res.csv_path,
        });
        store.dispatch({
          type: 'set_image_path_for_avivator',
          content: source,
        });
      }
    } else {
      let selectedIcon = state.experiment.current_model.custom_name;
      if (isNull(state.files.imagePathForAvivator)) {
        alert('Please enter your image file!');
        return;
      }
      if (selectedIcon === '') {
        alert('Please select your model!');
        useFlagsStore.setState({ DialogLoadingFlag: false });
        return;
      }

      let imgPath = '';
      if (typeof state.files.imagePathForAvivator === 'string') {
        imgPath = state.files.imagePathForAvivator;
      } else if (typeof state.files.imagePathForAvivator === 'object') {
        imgPath = state.files.imagePathForAvivator[0].path;
      }
      let exp_name = imgPath.split('/');
      useFlagsStore.setState({ DialogCustomFlag: false });
      useFlagsStore.setState({ DialogLoadingFlag: true });
      result = await api_experiment.testSegment(
        imgPath,
        exp_name,
        selectedIcon,
      );
      let imagePathForAvivator = null;
      if (result.data.error) {
        //alert("Error occured while getting the tree")
      } else {
        if (result.data.success === 'NO') {
          alert(
            'Your custom model is not suitable for this image. Please choose another model',
          );
          useFlagsStore.setState({ DialogLoadingFlag: false });
          return;
        }
        let file_path = result.data.success;
        exp_name = exp_name[exp_name.length - 2];
        // console.log('exp_name', exp_name);
        const file = await getImageUrl(exp_name + '/' + file_path, true, true);
        if (file) imagePathForAvivator = file;
      }
      // if (imagePathForAvivator.length <= 0) imagePathForAvivator = null;
      store.dispatch({
        type: 'set_image_path_for_avivator',
        content: imagePathForAvivator,
      });
      useFlagsStore.setState({ DialogLoadingFlag: false });
      useFlagsStore.setState({ DialogLockFlag: false });
      useFlagsStore.setState({ DialogCustomFlag: true });
    }
  };

  React.useEffect(() => {
    const state = store.getState();
    setTitle(state.experiment.current_model.custom_name);
  }, []);

  return (
    <>
      <Dialog open={DialogLockFlag} onClose={close} maxWidth={'450'}>
        <div className="d-flex border-bottom">
          <DialogTitle>{title} Method</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <Form.Label>
                You must enter your password to use {title} method in "ADVANCE"
                function.
              </Form.Label>
            </Col>
            <Col xs={6}>
              <Form.Control
                type="password"
                value={password}
                onChange={handleInput}
              />
            </Col>
            <Col xs={6}>
              {/* <Button variant="primary">callbrate</Button> */}
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={handlePasswordInput}>
              Confirm
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default LockScreen;
