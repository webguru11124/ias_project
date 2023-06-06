import React from 'react';
import SmallCard from '@/components/custom/SmallCard';
import { mdiPlayCircle, mdiCog } from '@mdi/js';
import Icon from '@mdi/react';
import Dec2dDialog from '../dialogs/Dec2dDialog';
import { useFlagsStore } from '@/state';
import { useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  DialogTitle,
  Fade,
  FormGroup,
  Modal,
  Slider,
  Snackbar,
} from '@mui/material';
import { Col, Row } from 'react-bootstrap';

export default function Dec2D() {
  const dialogFlag = useFlagsStore((store) => store.dialogFlag);

  const [effectiveness, setEffectiveness] = useState(5);

  // Modal Dialog
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleCloseSnackBar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSetDeconv2D = () => {
    handleOpen();
  };

  const onSetParams = () => {
    handleClose();
    setOpenSnackBar(true);
  };

  const onChangeSlider = (e) => {
    setEffectiveness(e.target.value);
  };

  const show2Ddialog = () => {
    useFlagsStore.setState({ dialogFlag: true });
  };

  return (
    <div className="">
      <SmallCard title="2D Deconvolution">
        <button className="btn btn-light btn-sm w-50" onClick={show2Ddialog}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiPlayCircle}
          ></Icon>
          2DGo
        </button>
        <button
          className="btn btn-light btn-sm w-50"
          onClick={handleSetDeconv2D}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCog}
          ></Icon>
          2DSet
        </button>
      </SmallCard>
      {dialogFlag && <Dec2dDialog />}

      <>
        <Modal
          open={open}
          onClose={handleClose}
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
              <DialogTitle style={{ textAlign: 'center' }}>
                Set 2D Deconvolution Params
              </DialogTitle>
              <hr />
              <FormGroup>
                <Row>
                  <DialogTitle>Effectiveness</DialogTitle>
                </Row>
                <Row>
                  <Col md={10}>
                    <Slider
                      size="small"
                      defaultValue={effectiveness}
                      onChange={onChangeSlider}
                    />
                  </Col>
                  <Col md={2}>
                    <DialogTitle>{effectiveness}</DialogTitle>
                  </Col>
                </Row>
              </FormGroup>

              <hr />
              <Row>
                <Col md={9}></Col>
                <Button
                  style={{ textAlign: 'center' }}
                  className=""
                  variant="contained"
                  color="success"
                  size="medium"
                  onClick={onSetParams}
                >
                  Set
                </Button>
              </Row>
            </Box>
          </Fade>
        </Modal>
      </>
      <>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={2000}
          onClose={handleCloseSnackBar}
          message="2D Deconvolution Parameters successfully setted"
        />
      </>
    </div>
  );
}
