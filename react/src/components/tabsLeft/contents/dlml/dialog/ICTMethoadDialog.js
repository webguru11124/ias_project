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
import { useState } from 'react';

const ICTMethodDialog = () => {
  const DialogICTSelectFlag = useFlagsStore(
    (store) => store.MLDialogICTSelectFlag,
  );
  const [sensitivity, setSensitivity] = useState(50);

  const close = (event, reason) => {
    useFlagsStore.setState({ MLDialogICTSelectFlag: false });
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    return false;
  };

  const handleSelectedMethod = (newValue) => {};

  const handleDaysChange = (event) => {
    // let value = event.target.value;
    // console.log('handle-days-change:', value);
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
                    <RadioGroup aria-label="days" onChange={handleDaysChange}>
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
