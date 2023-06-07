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
import { connect, useSelector } from 'react-redux';
import Channel from '@/components/tabsRight/contents/viewcontrol/Channel';
import ToggleButton from '@mui/material/ToggleButton';
import Icon from '@mdi/react';
import { mdiImageCheck, mdiImageOutline } from '@mdi/js';
import { COLORS } from '@/constants';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Modal } from 'antd';
import Draggable from 'react-draggable';

const mapStateToProps = (state) => ({
  showICTMethodDialog: state.measure.showICTMethodDialog,
});

const ICTMethodDialog = (props) => {
  const DialogICTSelectFlag = useFlagsStore(
    (store) => store.MLDialogICTSelectFlag,
  );
  const [sensitivity, setSensitivity] = useState(50);
  const [type, setType] = useState('a');
  const [viewMode, setViewMode] = useState('merge');

  const maxDialogWidth = 800;
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [showFooter, setShowFooter] = useState(true);
  const draggleRef = React.createRef();
  const imagePathForAvivator = useSelector(
    (state) => state.files.imagePathForAvivator,
  );
  const imagePathForOrigin = useSelector(
    (state) => state.files.imagePathForOrigin,
  );

  useEffect(() => {
    setVisible(props.showICTMethodDialog);
  }, [props]);

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  const close = (event, reason) => {
    // useFlagsStore.setState({ MLDialogICTSelectFlag: false });
    store.dispatch({
      type: 'UPDATE_ICT_METHOD_DIALOG_STATUS',
      payload: false,
    });
  };

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

  const handleTest = async () => {
    // useFlagsStore.setState({ MLDialogICTSelectFlag: false });
    const state = store.getState();
    let fullPath = state.files.imagePathForOrigin;
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
      original_image_path: imgPath,
    };
    res = await api_experiment.MLConvertResult(_payload);
    useFlagsStore.setState({ DialogLoadingFlag: false });
    // console.log('ICT-convert-result:', res);
    let source = getImageUrl(res.image_path, false, true);
    let source1 = getImageUrl(res.image_count_path, false, true);
    store.dispatch({ type: 'set_image_path_for_result', content: source });
    // store.dispatch({
    //   type: 'set_image_path_for_count_result',
    //   content: source1,
    // });
    store.dispatch({
      type: 'set_csv_path_for_result',
      content: res.csv_path,
    });
    store.dispatch({ type: 'set_image_path_for_avivator', content: source });
  };

  const handleChangeViewMode = (e, newViewMode) => {
    e.stopPropagation();
    setViewMode(newViewMode);
  };

  const handleSelectedMethod = async () => {
    const state = store.getState();
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForOrigin,
    });
    // useFlagsStore.setState({ MLDialogICTSelectFlag: false });
    store.dispatch({
      type: 'UPDATE_ICT_METHOD_DIALOG_STATUS',
      payload: false,
    });
  };

  const handleDaysChange = (event) => {
    // let value = event.target.value;
    // console.log('handle-days-change:', value);
    setType(event.target.value);
  };

  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        keyboard={false}
        wrapClassName="aaa"
        width={527}
        style={{
          position: 'fixed',
          // transform: 'translateX(-50%)',
          left: (document.body.clientWidth - 848) / 2,
        }}
        // zIndex={-1}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            <div className="d-flex border-bottom">
              <DialogTitle>iCT NMethod</DialogTitle>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleChangeViewMode}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ToggleButton
                  className="toggleBtn"
                  value="unmerge"
                  aria-label="list"
                >
                  <Icon
                    path={mdiImageOutline}
                    size={1}
                    color={COLORS.LIGHT_CYAN}
                  />
                </ToggleButton>
                <ToggleButton
                  className="toggleBtn"
                  value="unmerge"
                  aria-label="module"
                >
                  <Icon
                    path={mdiImageCheck}
                    size={1}
                    color={COLORS.LIGHT_CYAN}
                  />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        }
        footer={
          !showFooter
            ? null
            : [
                <div className="flex justify-content-center">
                  <button
                    key="back"
                    onClick={handleTest}
                    className="btn btn-outline-dark"
                    style={{ marginRight: '10px' }}
                  >
                    Test
                  </button>
                  <button
                    key="back"
                    onClick={handleSelectedMethod}
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Select
                  </button>
                  <button
                    key="back"
                    onClick={close}
                    className="btn btn-outline-dark"
                    style={{ marginRight: '10px' }}
                  >
                    Cancel
                  </button>
                </div>,
              ]
        }
        visible={visible}
        onOk={handleSelectedMethod}
        onCancel={close}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
            key="measure-item-dialog"
          >
            <div aa="2" ref={draggleRef}>
              {modal}
            </div>
          </Draggable>
        )}
      >
        <div className="mx-3 my-2" style={{ width: 450 }}>
          <Row>
            <Col xs={12}>
              <Channel />
            </Col>
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
      </Modal>
    </>
  );
};
export default connect(mapStateToProps)(ICTMethodDialog);
