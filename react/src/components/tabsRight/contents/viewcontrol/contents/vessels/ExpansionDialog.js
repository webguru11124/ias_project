import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slides from './Slides';
import WellPlates from './WellPlates';
import Dishes from './Dishes';
import Wafers from './Wafers';
import { getVesselById } from '@/constants/vessel-types';
import NumericInput from 'react-numeric-input';
import store from '@/reducers';
import vessel from '@/reducers/modules/vessel';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const ExpansionDialog = (props) => {
  const vessel_data = useSelector((state) => state.measure.vessel_data);
  const maxDialogWidth = 600;
  const [open, setOpen] = useState(true);
  const [currentVessel, setCurrentVessel] = useState(props.currentVessel);
  const handleClose = () => {
    updateExpansionSize();
    props.closeDialog(areaPercentage);
  };

  useEffect(() => {
    setAreaPercentage(vessel_data.area_percentage);
  }, [vessel_data]);

  const updateExpansionSize = () => {
    store.dispatch({
      type: 'UPDATE_MEASURE_VESSEL_DATA',
      payload: {
        area_percentage: areaPercentage,
      },
    });
  };

  const changeCurrentVessel = (id) => {
    setCurrentVessel(id);
    if (props.changeVessel) {
      props.changeVessel(id);
    }
  };

  const [areaPercentage, setAreaPercentage] = useState(
    vessel_data.area_percentage,
  );

  useEffect(() => {
    setOpen(props.open);
    setCurrentVessel(props.currentVessel);
  }, [props]);

  const renderVesselItem = (vessel) => {
    if (vessel) {
      switch (vessel.type) {
        case 'Slide':
          return (
            <div
              role="button"
              onClick={() => {
                changeCurrentVessel(vessel.id);
              }}
              style={{ width: maxDialogWidth }}
            >
              <Slides
                width={maxDialogWidth}
                count={1}
                key={vessel.id}
                showHole={true}
                areaPercentage={areaPercentage}
              />
            </div>
          );
        case 'Dish':
          return (
            <div
              role="button"
              onClick={() => {
                changeCurrentVessel(vessel.id);
              }}
              style={{ width: maxDialogWidth }}
            >
              <Dishes
                width={maxDialogWidth}
                size={vessel.size}
                key={vessel.id}
                showHole={true}
                areaPercentage={areaPercentage}
              />
            </div>
          );
        case 'WellPlate':
          return (
            <div
              role="button"
              onClick={() => {
                changeCurrentVessel(vessel.id);
              }}
              style={{ width: maxDialogWidth }}
            >
              <WellPlates
                width={maxDialogWidth}
                rows={1}
                cols={1}
                showName={true}
                key={vessel.id}
                showNumber={true}
                showHole={true}
                areaPercentage={areaPercentage}
              />
            </div>
          );
        case 'Wafer':
          return (
            <div
              role="button"
              onClick={() => {
                changeCurrentVessel(vessel.id);
              }}
              style={{ width: maxDialogWidth }}
            >
              <Wafers
                width={maxDialogWidth}
                size={vessel.size}
                key={vessel.id}
                showHole={true}
                areaPercentage={areaPercentage}
              />
            </div>
          );
        default:
          return;
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={(maxDialogWidth + 5).toString()}
    >
      <div className="d-flex border-bottom">
        <DialogTitle>Vessel Expansion</DialogTitle>
        <button
          className="dialog-close-btn"
          color="primary"
          size="small"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
      <div style={{ width: maxDialogWidth + 5 }} className="border">
        {renderVesselItem(getVesselById(currentVessel))}
        <div
          className="d-flex"
          style={{
            width: '50%',
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '36px',
          }}
        >
          <span style={{ width: '30%' }}>Area</span>
          <NumericInput
            min={0}
            max={100}
            value={areaPercentage}
            style={{
              wrap: {
                width: '30%',
              },
              input: {
                width: '100%',
              },
            }}
            onChange={(value) => setAreaPercentage(value)}
          ></NumericInput>
          <span style={{ width: '30%' }}>%</span>
        </div>
        {/* <HoleArea /> */}
      </div>
      <DialogActions>
        <DialogActions>
          <Button
            className="pa-1"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            OK
          </Button>
        </DialogActions>
      </DialogActions>
    </Dialog>
  );
};
