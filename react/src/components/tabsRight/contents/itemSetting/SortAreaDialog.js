import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import SortItemTop from './contents/sortItem/SortItemTop';
import SortItemBottom from './contents/sortItem/SortItemBottom';
import { connect, useSelector } from 'react-redux';
import store from '@/reducers';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Icon from '@mdi/react';
import { mdiImageCheck, mdiImageOutline } from '@mdi/js';
import { COLORS } from '@/constants';

const mapStateToProps = (state) => ({
  showSortAreaDialog: state.measure.showSortAreaDialog,
});

const SortAreaDialog = (props) => {
  const [open] = useState(true);
  const maxDialogWidth = 800;
  const [currentClass, setCurrentClass] = useState(-1);
  const [currentMeasureItem, setCurrentMeasureItem] = useState('');
  const [currentBins, setCurrentBins] = useState(16);
  const imagePathForOrigin = useSelector(
    (state) => state.files.imagePathForOrigin,
  );
  const imagePathForResult = useSelector(
    (state) => state.files.imagePathForResult,
  );

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

  useEffect(() => {
    setVisible(props.showSortAreaDialog);
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

  const handleClose = () => {
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForOrigin,
    });
    // props.closeDialog();
    store.dispatch({
      type: 'UPDATE_SORT_AREA_DIALOG_STATUS',
      payload: false,
    });
  };

  const onChangeClass = (value) => {
    setCurrentClass(value);
  };

  const onChangeMeasureItem = (value) => {
    setCurrentMeasureItem(value);
  };

  const onChangeBins = (value) => {
    setCurrentBins(value);
  };

  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        keyboard={false}
        wrapClassName="aaa"
        width={800}
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
              <DialogTitle>Sort Area</DialogTitle>
            </div>
          </div>
        }
        footer={
          !showFooter
            ? null
            : [
                <div className="flex justify-content-center">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Apply on Close"
                    sx={{ marginBottom: '0' }}
                  />

                  <button
                    key="back"
                    onClick={handleClose}
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Select
                  </button>
                  <button
                    key="back"
                    onClick={handleClose}
                    className="btn btn-outline-dark"
                    style={{ marginRight: '10px' }}
                  >
                    Cancel
                  </button>
                </div>,
              ]
        }
        visible={visible}
        onOk={handleClose}
        onCancel={handleClose}
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
        <div>
          <SortItemTop
            onChangeClass={onChangeClass}
            onChangeMeasure={onChangeMeasureItem}
            onChangeBins={onChangeBins}
          />
          <SortItemBottom
            currentClass={currentClass}
            currentMeasureItem={currentMeasureItem}
            currentBins={currentBins}
          />
        </div>
      </Modal>
    </>
  );
};
export default connect(mapStateToProps)(SortAreaDialog);
