import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import SortItemTop from './contents/sortItem/SortItemTop';
import SortItemBottom from './contents/sortItem/SortItemBottom';
import { useSelector } from 'react-redux';
import store from '@/reducers';

export default function SortAreaDialog(props) {
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

  const handleClose = () => {
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForOrigin,
    });
    props.closeDialog();
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
    <Dialog open={open} onClose={handleClose} maxWidth={'800'}>
      <div className="d-flex border-bottom">
        <DialogTitle>Sort Area</DialogTitle>
        <button
          className="dialog-close-btn"
          color="primary"
          size="small"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
      <div style={{ width: maxDialogWidth, margin: '16px 0' }}>
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
      <div className="border-top">
        <DialogActions>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Apply on Close"
            sx={{ marginBottom: '0' }}
          />
          <Button
            className=""
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            Select
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
