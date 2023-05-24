import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Candidate from './contents/measureItem/Candidate';
import Selected from './contents/measureItem/Selected';
import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDoubleRight,
  mdiTrashCanOutline,
} from '@mdi/js';
import { connect, useSelector } from 'react-redux';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import { getCSVUrl } from '@/helpers/file';
import { readRemoteFile } from 'react-papaparse';
import store from '@/reducers';

const mapStateToProps = (state) => ({
  showMeasureItemPopup: state.measure.showMeasureItemPopup,
});

const MeasureItemDialog = (props) => {
  const [open] = useState(true);
  const [tab, setTab] = useState(0);
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
  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );

  const csvResultPath = useSelector((state) => state.files.csvPathForResult);

  useEffect(() => {
    // console.log('csv-path:', csvResultPath);
    let path = getCSVUrl(csvResultPath);
    if (path) {
      readRemoteFile(path, {
        complete: (results) => {
          // console.log('csv-data:', results);
        },
      });
    }
  }, [csvResultPath]);

  useEffect(() => {
    setVisible(props.showMeasureItemPopup);
  }, [props]);

  const handleTabChange = (_event, newValue) => {
    setTab(newValue);
  };

  const handleClose = () => {
    store.dispatch({
      type: 'UPDATE_MEASURE_ITEM_POPUP_STATUS',
      payload: false,
    });
  };

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

  const handleOk = (e) => {
    store.dispatch({
      type: 'UPDATE_MEASURE_ITEM_POPUP_STATUS',
      payload: false,
    });
  };

  const handleCancel = (e) => {
    store.dispatch({
      type: 'UPDATE_MEASURE_ITEM_POPUP_STATUS',
      payload: false,
    });
  };

  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        keyboard={false}
        wrapClassName="aaa"
        width={848}
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
            <div className="flex justify-between items-end">
              <div className="flex">
                <div className="flex flex-col justify-between">
                  <div>Measure Item</div>
                </div>
              </div>
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
                    onClick={handleClose}
                    className="btn btn-outline-dark"
                    style={{ marginRight: '10px' }}
                  >
                    Adjust
                  </button>
                  <button
                    key="back"
                    onClick={handleClose}
                    className="btn btn-outline-dark"
                    style={{ marginRight: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    key="back"
                    onClick={handleClose}
                    className="btn btn-primary"
                  >
                    Select
                  </button>
                </div>,
              ]
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div aa="2" ref={draggleRef}>
              {modal}
            </div>
          </Draggable>
        )}
      >
        <div style={{ width: maxDialogWidth }} className="border">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleTabChange} className="">
              {classSettingData.length ? (
                classSettingData.map((row, index) => (
                  <Tab
                    className="common-tab-button"
                    label={row.className}
                    key={index}
                  ></Tab>
                ))
              ) : (
                <></>
              )}
            </Tabs>
            <div
              className="d-flex justify-content-between"
              style={{
                margin: '0 12px 12px 12px',
                borderTop: '1px solid #dfdfdf',
              }}
            >
              <Candidate />
              <DialogActions
                className="d-flex"
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <Button>
                  <Icon
                    size={1.2}
                    horizontal
                    vertical
                    rotate={180}
                    color="#000000de"
                    path={mdiChevronRight}
                    style={{ border: '1px solid #000000de' }}
                  ></Icon>
                </Button>
                <Button style={{ margin: '0' }}>
                  <Icon
                    size={1.2}
                    horizontal
                    vertical
                    rotate={180}
                    color="#000000de"
                    path={mdiChevronDoubleRight}
                    style={{ border: '1px solid #000000de' }}
                  ></Icon>
                </Button>
                <Button style={{ margin: '0' }}>
                  <Icon
                    size={1.2}
                    horizontal
                    vertical
                    rotate={180}
                    color="#000000de"
                    path={mdiChevronLeft}
                    style={{ border: '1px solid #000000de' }}
                  ></Icon>
                </Button>
                <Button style={{ margin: '0' }}>
                  <Icon
                    size={1.2}
                    horizontal
                    vertical
                    rotate={180}
                    color="#000000de"
                    path={mdiTrashCanOutline}
                    style={{ border: '1px solid #000000de' }}
                  ></Icon>
                </Button>
              </DialogActions>
              <Selected />
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
};
export default connect(mapStateToProps)(MeasureItemDialog);
