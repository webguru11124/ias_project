import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import store from '@/reducers';
import { connect, useSelector } from 'react-redux';
import Channel from '@/components/tabsRight/contents/viewcontrol/Channel';
import MLContainer from '@/components/tabsLeft/MLContainer';
import ToggleButton from '@mui/material/ToggleButton';
import Icon from '@mdi/react';
import { mdiImageCheck, mdiImageOutline } from '@mdi/js';
import { COLORS } from '@/constants';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const mapStateToProps = (state) => ({
  showMLPopup: state.measure.showMLPopup,
});

const MLPopupDialog = (props) => {
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [showFooter, setShowFooter] = useState(true);
  const [viewMode, setViewMode] = useState('original');

  const draggleRef = React.createRef();
  const imagePathForOrigin = useSelector(
    (state) => state.files.imagePathForOrigin,
  );
  const imagePathForResult = useSelector(
    (state) => state.files.imagePathForResult,
  );

  useEffect(() => {
    setVisible(props.showMLPopup);
  }, [props]);

  const handleOk = (e) => {
    store.dispatch({
      type: 'UPDATE_ML_POPUP_STATUS',
      payload: false,
    });
  };

  const handleCancel = (e) => {
    store.dispatch({
      type: 'UPDATE_ML_POPUP_STATUS',
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

  const handleChangeViewMode = (e, newViewMode) => {
    e.stopPropagation();
    setViewMode(newViewMode);
    if (newViewMode === 'original') {
      store.dispatch({
        type: 'set_image_path_for_avivator',
        content: imagePathForOrigin,
      });
    } else {
      store.dispatch({
        type: 'set_image_path_for_avivator',
        content: imagePathForResult,
      });
    }
  };

  return (
    <>
      <Modal
        mask={false}
        maskClosable={false}
        keyboard={false}
        wrapClassName="aaa"
        width={300}
        style={{
          position: 'fixed',
          // transform: 'translateX(-50%)',
          left: (document.body.clientWidth - 500) / 2,
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
                  <div>Machine Learning Dialog</div>
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
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Set
                  </button>
                  <button
                    key="back"
                    onClick={handleCancel}
                    className="btn btn-outline-dark"
                  >
                    Cancel
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
        <div className="ml-popup-body">
          <div
            className="flex justify-space-between align-center"
            style={{ display: 'flex', marginBottom: '8px' }}
          >
            <label>Show Origin/Result Image</label>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleChangeViewMode}
            >
              <ToggleButton
                className="toggleBtn"
                value="original"
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
                value="processed"
                aria-label="module"
                disabled={!imagePathForResult}
              >
                <Icon path={mdiImageCheck} size={1} color={COLORS.LIGHT_CYAN} />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Channel />
          <MLContainer />
        </div>
      </Modal>
    </>
  );
};

export default connect(mapStateToProps)(MLPopupDialog);
