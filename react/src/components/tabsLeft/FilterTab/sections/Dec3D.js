import SmallCard from '@/components/custom/SmallCard';
import { mdiPlayCircle, mdiCog } from '@mdi/js';
import Icon from '@mdi/react';
import Dec3dDialog from '../dialogs/Dec3dDialog';
import { useFlagsStore } from '@/state';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
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
import store from '@/reducers';
import { processDeconv3D } from '@/api/filter';
import { toTiffPath } from '@/helpers/avivator';
import { getImageByPath } from '@/api/image';
import { getImageUrl } from '@/helpers/file';

export default function Dec3D() {
  const [effectiveness, setEffectiveness] = useState(5);

  const [infoMessage, setInfoMessage] = useState('');

  const imagePathForOrigin = useSelector(
    (state) => state.files.imagePathForOrigin,
  );

  // Modal Dialog
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // SnackBar variables

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleCloseSnackBar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const getOmeTiffUrl = (url) => {
    let tempUrl = url;
    const ext = url.split('.').pop();
    if (ext !== 'tiff' && ext !== 'tif') {
      const newExtension = 'ome.tiff';
      tempUrl = url.replace(/\.[^/.]+$/, `.${newExtension}`);
    }

    const serverUrl = imagePathForOrigin.split('image/download')[0];
    const path = tempUrl.split('static')[1];

    const newUrl = serverUrl + `image/download/?path=${path}`;

    return newUrl;
  };

  const onSetParams = () => {
    handleClose();
    setInfoMessage('3D Deconvolution Parameters successfully setted');
    setOpenSnackBar(true);
  };

  const onChangeSlider = (e) => {
    setEffectiveness(e.target.value);
  };

  const handleSet = () => {
    handleOpen();
  };

  //Handle 3D Deconvolution
  const handleDeconv3D = async () => {
    setInfoMessage(
      '3D Deconvolution is performing now, please wait a moment...',
    );
    setOpenSnackBar(true);

    const filenames = [];

    if (
      imagePathForOrigin &&
      imagePathForOrigin !== null &&
      imagePathForOrigin.length >= 1
    ) {
      imagePathForOrigin.map((item) => {
        filenames.push(item.path);
      });
    }

    const dictRoiPts = {
      startX: 0,
      startY: 0,
      endX: 100,
      endY: 100,
    };
    const isroi = true;
    const efftive_value = effectiveness;

    const params = {
      dictRoiPts: dictRoiPts,
      filenames: filenames,
      isroi: isroi,
      effectiveness: efftive_value,
    };

    const selectedFiles = await processDeconv3D(params);

    //console.log(selectedFiles);

    let source = null;
    if (selectedFiles.length > 1) {
      source = await Promise.all(
        selectedFiles.map((path) => getImageByPath(toTiffPath(path))),
      );
    } else if (selectedFiles.length === 1) {
      source = getImageUrl(toTiffPath(selectedFiles[0]), true, true);
    }

    //console.log(source);

    store.dispatch({ type: 'set_image_path_for_avivator', content: source });
    store.dispatch({ type: 'set_image_path_for_result', content: source });
  };
  return (
    <div className="">
      <SmallCard title="3D Deconvolution">
        <button className="btn btn-light btn-sm w-50" onClick={handleDeconv3D}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiPlayCircle}
          ></Icon>
          3DGo
        </button>
        <button className="btn btn-light btn-sm w-50" onClick={handleSet}>
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCog}
          ></Icon>
          3DSet
        </button>
        {/* <CustomButton icon={mdiPlayCircle} label="3DGo" click={select1} />
                <CustomButton icon={mdiCog} label="3DSet" click={select2} /> */}
      </SmallCard>
      {/* {Dialog3dflag && <Dec3dDialog />} */}

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
                Set 3D Deconvolution Params
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
          message={infoMessage}
        />
      </>
    </div>
  );
}
