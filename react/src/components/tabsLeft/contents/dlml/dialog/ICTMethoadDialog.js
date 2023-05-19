import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore, useViewerStore } from '@/state';
import { Button, Col, Row } from 'react-bootstrap';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import { range } from '@/helpers/avivator';
import InputBase from '@mui/material/InputBase';
import { useState, useEffect } from 'react';
import * as api_experiment from '@/api/experiment';
import store from '@/reducers';
import { getImageUrl } from '@/helpers/file';
import { useSelector } from 'react-redux';

const ICTMethodDialog = () => {
  const DialogICTSelectFlag = useFlagsStore(
    (store) => store.MLDialogICTSelectFlag,
  );
  const [sensitivity, setSensitivity] = useState(50);
  const [type, setType] = useState('a');

  const close = (event, reason) => {
    useFlagsStore.setState({ MLDialogICTSelectFlag: false });
  };

  const imagePathForAvivator = useSelector(
    (state) => state.files.imagePathForAvivator,
  );

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    if (imagePathForAvivator) {
      let path = imagePathForAvivator.toLowerCase();
      if (path.indexOf('pointa') >= 0) {
        setType('a');
      }
      if (path.indexOf('pointb') >= 0) {
        setType('b');
      }
      if (path.indexOf('pointc') >= 0) {
        setType('c');
      }
      if (path.indexOf('pointd') >= 0) {
        setType('d');
      }
    }
  }, [imagePathForAvivator]);

  const handleSelectedMethod = async () => {
    useFlagsStore.setState({ MLDialogICTSelectFlag: false });
    const state = store.getState();
    let fullPath = state.files.imagePathForAvivator;
    let subPath = /path=(.*)/.exec(fullPath)[1];
    let imgPath = subPath.split('/').slice(1).join('/');

    useFlagsStore.setState({ DialogLoadingFlag: true });
    let _payload = {
      original_image_url: imgPath,
      type,
      sensitivity,
    };
    store.dispatch({
      type: 'UPDATE_ML_MEASURE_PARAMS',
      payload: {
        method: 'iCT',
        type,
        sensitivity,
      },
    });
    let res = await api_experiment.MLICTProcessImage(_payload);
    // console.log('ICT-result:', res);
    _payload = {
      image_path: res.image_path,
    };
    res = await api_experiment.MLConvertResult(_payload);
    useFlagsStore.setState({ DialogLoadingFlag: false });
    // console.log('ICT-convert-result:', res);
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
    store.dispatch({ type: 'set_image_path_for_avivator', content: source });
  };

  const handleDaysChange = (event) => {
    // let value = event.target.value;
    // console.log('handle-days-change:', value);
    setType(event.target.value);
  };

  return (
    <>
      <Dialog
        open={DialogICTSelectFlag}
        onClose={close}
        maxWidth={'450'}
        onBackdropClick={handleBackdropClick}
      >
        <div className="d-flex border-bottom">
          <DialogTitle>iCT NMethod</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <div className="card border has-title">
                <div className="card-title">
                  <label>Select Days</label>
                </div>
                <div style={{ padding: '15px' }}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="days"
                      onChange={handleDaysChange}
                      value={type}
                    >
                      <FormControlLabel
                        value="a"
                        control={<Radio />}
                        label="PointA"
                      />
                      <FormControlLabel
                        value="b"
                        control={<Radio />}
                        label="PointB"
                      />
                      <FormControlLabel
                        value="c"
                        control={<Radio />}
                        label="PointC"
                      />
                      <FormControlLabel
                        value="d"
                        control={<Radio />}
                        label="PointD"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>

              <div
                className="card border has-title"
                style={{ marginTop: '20px' }}
              >
                <div className="card-title">
                  <label>Sensitivity</label>
                </div>
                <div
                  style={{ padding: '15px' }}
                  className="flex-input-container"
                >
                  <Slider
                    value={sensitivity}
                    onChange={(event, newValue) => {
                      setSensitivity(newValue);
                    }}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    orientation="horizontal"
                  />

                  <InputBase
                    value={sensitivity}
                    type="number"
                    onChange={(event) => {
                      setSensitivity(event.target.value);
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button variant="contained" onClick={handleSelectedMethod}>
              Select
            </Button>
            <Button variant="contained" onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};
export default ICTMethodDialog;
