import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useFlagsStore } from '@/state';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { Backdrop, Box, Fade, Modal } from '@mui/material';
import Avivator from '@/components/avivator/Avivator';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import useMetadata from '@/hooks/useMetadata';
import UserCanvas from '@/components/custom/UserCanvas';
import { useRef } from 'react';

const Dec2dDialog = () => {
  const dialogFlag = useFlagsStore((store) => store.dialogFlag);
  const imagePathForAvivator = useSelector(
    (state) => state.files.imagePathForAvivator,
  );
  const close = () => {
    useFlagsStore.setState({ dialogFlag: false });
  };

  const canvasElement = useRef(null);

  // Variables for modal dialog for ROI selection
  // Modal Dialog
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const setROI = () => {};

  useEffect(() => {
    //console.log(imagePathForAvivator);
  }, [imagePathForAvivator]);

  const action = () => {};

  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (
    <>
      <Dialog
        open={dialogFlag}
        onClose={close}
        maxWidth={'350'}
        PaperComponent={PaperComponent}
        hideBackdrop={true}
        onBackdropClick="false"
        disableScrollLock
        aria-labelledby="draggable-dialog-title"
      >
        <div className="d-flex border-bottom">
          <DialogTitle>2D Deconvolution</DialogTitle>
          <button className="dialog-close-btn" color="primary" onClick={close}>
            &times;
          </button>
        </div>
        <div
          className="d-flex justify-content-around mx-5 my-2"
          style={{ width: 350 }}
        >
          <Col className="pa-0">
            <ListSubheader>Selected ROI</ListSubheader>
          </Col>
          <Col className="pa-0">
            <ListSubheader>Effectiveness</ListSubheader>
            <Slider size="small" defaultValue={50} />
          </Col>
        </div>
        <div className="border-top mt-2">
          <DialogActions>
            <Button
              className=""
              variant="contained"
              color="success"
              size="medium"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className=""
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleModalOpen}
            >
              ROI
            </Button>
            <Button
              className=""
              variant="contained"
              color="primary"
              size="medium"
              onClick={action}
            >
              Action
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <>
        <Modal
          open={open}
          onClose={handleModalClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <Row>
                <h2 style={{ fontFamily: 'monospace' }}>
                  Select ROI for Deconvolution
                </h2>
              </Row>
              <Row
                style={{
                  overflow: 'auto',
                  width: '700px',
                  height: '500px',
                  overflowY: 'auto',
                }}
              >
                <Paper></Paper>
              </Row>
              <Row>
                <Button>Set</Button>
                <Button>Reset</Button>
                <Button onClick={handleModalClose}>Close</Button>
              </Row>
            </Box>
          </Fade>
        </Modal>
      </>
    </>
  );
};
export default Dec2dDialog;
