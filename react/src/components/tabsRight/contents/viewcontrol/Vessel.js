import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import Card from '@mui/material/Card';
import { getVesselById, VESSELS } from '@/constants/vessel-types';
import { useElementSize } from 'usehooks-ts';
import Dishes from './contents/vessels/Dishes';
import Slides from './contents/vessels/Slides';
import WellPlates from './contents/vessels/WellPlates';
import Wafers from './contents/vessels/Wafers';
import store from '../../../../reducers';
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiSyncAlert,
  mdiImageFilterCenterFocus,
} from '@mdi/js';
import Icon from '@mdi/react';
import { SelectDialog } from './contents/vessels/SelectDialog';
import { ExpansionDialog } from './contents/vessels/ExpansionDialog';

const mapStateToProps = (state) => ({
  content: state.files.content,
  files: state.files.files,
});

const Vessel = (props) => {
  const vesselData = useSelector((state) => state.vessel);
  const measureData = useSelector((state) => state.measure);
  // console.log("measure Dtata, vessel Data", measureData, measureData.vessel_data)

  const [shape, setShape] = useState('rect'); // ['rect', 'circle']
  const [currentVesselId, setCurrentVesselId] = useState(
    measureData.vessel_data.id,
  );
  const [currentVessel, setCurrentVessel] = useState(measureData.vessel_data);
  const [showSelectDialog, setShowSelectDialog] = useState(false);
  const [showExpansionDialog, setShowExpansionDialog] = useState(false);
  const [contents, setContents] = useState(props.content ?? []); //added ?? by QmQ
  const [ref, { width }] = useElementSize();

  const [slideSelect, setSlideSelect] = useState(false);

  // updated by QmQ
  useEffect(() => {
    store.dispatch({
      type: 'SET_VESSEL_STATUS_COUNT',
      count: currentVessel.count ?? 1,
    });
  }, [currentVessel]);

  // ** measurement view part update  ** QmQ
  const setCurrentVesselStatus = (id) => {
    let _currentVesselContent = getVesselById(id);
    setCurrentVesselId(id);
    setCurrentVessel(_currentVesselContent);

    store.dispatch({
      type: 'UPDATE_MEASURE_VESSEL_DATA',
      payload: _currentVesselContent,
    });
  };

  const getCorrectVesselID = (seriesStr, maxRow, maxCol) => {
    // console.log('get correct vessel id', seriesStr, maxRow, maxCol)
    let vesselID = -1;
    let currentVesselTypeGroup = [];

    for (let i = 0; i < VESSELS.length; i++) {
      if (seriesStr.includes(VESSELS[i][0].type)) {
        currentVesselTypeGroup = VESSELS[i];
        break;
      }
      if (seriesStr.includes('Plate') && VESSELS[i][0].type.includes('Plate')) {
        currentVesselTypeGroup = VESSELS[i];
        break;
      }
    }

    if (currentVesselTypeGroup.length > 0) {
      for (let i = 0; i < currentVesselTypeGroup.length; i++) {
        if (currentVesselTypeGroup[0].type === 'WellPlate') {
          if (
            currentVesselTypeGroup[i].rows >= maxRow &&
            currentVesselTypeGroup[i].cols >= maxCol
          ) {
            vesselID = currentVesselTypeGroup[i].id;
            break;
          }
        } else if (
          currentVesselTypeGroup[0].type === 'Dish' ||
          currentVesselTypeGroup[0].type === 'Wafer'
        ) {
          if (currentVesselTypeGroup[i].size >= maxRow * maxCol) {
            vesselID = currentVesselTypeGroup[i].id;
            break;
          }
        } else if (currentVesselTypeGroup[0].type === 'Slide') {
          if (currentVesselTypeGroup[i].count >= maxRow * maxCol) {
            vesselID = currentVesselTypeGroup[i].id;
            break;
          }
        }
      }
    }

    if (vesselID === -1) {
      // console.log('There is no suitable size in VESSEL!');
      vesselID = 12;
      if (currentVesselTypeGroup[0]) {
        if (currentVesselTypeGroup[0].type === 'Slide') vesselID = 1;
      }
    }
    if (currentVesselTypeGroup.length == 0) {
      vesselID = 1;
    }
    return vesselID;
  };

  const changeVesselSeries = (direction) => {
    let current_VesselGroupIndex = 0;
    for (let i = 0; VESSELS.length; i++) {
      if (VESSELS[i][0].type === currentVessel.type) {
        current_VesselGroupIndex = i;
        break;
      }
    }
    let maxRow = 0;
    let maxCol = 1;
    let current_contents = [...contents];
    for (let i = 0; i < current_contents.length; i++) {
      if (current_contents[i].row > maxRow) maxRow = current_contents[i].row;
      if (current_contents[i].col > maxCol) maxCol = current_contents[i].col;
    }
    let seriesStr = currentVessel.type;
    if (direction) {
      if (current_VesselGroupIndex === VESSELS.length - 1) {
        seriesStr = VESSELS[0][0].type;
      } else {
        seriesStr = VESSELS[current_VesselGroupIndex + 1][0].type;
      }
    } else {
      if (current_VesselGroupIndex === 0) {
        seriesStr = VESSELS[VESSELS.length - 1][0].type;
      } else {
        seriesStr = VESSELS[current_VesselGroupIndex - 1][0].type;
      }
    }
    let vesselID = getCorrectVesselID(seriesStr, maxRow + 1, maxCol);
    setCurrentVesselStatus(vesselID);
  };
  const handleExpansionDialogClose = (percentVal) => {
    store.dispatch({
      type: 'UPDATE_MEASURE_VESSEL_DATA',
      payload: { area_percentage: percentVal },
    });
    setShowExpansionDialog(false);
  };
  useEffect(() => {
    if (props.content && props.content !== []) {
      let current_contents = JSON.parse(JSON.stringify(props.content));

      //console.log(current_contents);

      setContents(JSON.parse(JSON.stringify(current_contents)));

      //console.log("Current Content is ");
      //console.log(current_contents);
      let current_vessel = {
        id: 12,
        type: 'WellPlate',
        rows: 8,
        cols: 12,
        title: '96',
        showName: true,
      };
      let maxRow = 0;
      let maxCol = 1;
      for (let i = 0; i < current_contents.length; i++) {
        if (current_contents[i].row > maxRow) maxRow = current_contents[i].row;
        if (current_contents[i].col > maxCol) maxCol = current_contents[i].col;
      }
      current_vessel = getVesselById(
        getCorrectVesselID(current_contents[0].series, maxRow + 1, maxCol),
      );
      setCurrentVessel(current_vessel);
      setCurrentVesselId(current_vessel.id);

      if (current_contents[0].vesselID) {
        current_vessel = getVesselById(current_contents[0].vesselID);
        setCurrentVessel(current_vessel);
        setCurrentVesselId(current_vessel.id);

        if (current_contents[0].vesselID === 1) {
          setSlideSelect(true);
        }
      }
    }
  }, [props.content]);

  if (currentVessel == null) {
    return <></>;
  }

  const renderVessel = () => {
    if (currentVessel) {
      switch (currentVessel.type) {
        case 'Slide':
          return (
            <Slides
              width={width}
              count={currentVessel.count}
              showHole={slideSelect}
              areaPercentage={100}
            />
          );
        case 'Dish':
          return <Dishes width={width} size={currentVessel.size} />;
        case 'WellPlate':
          return (
            <WellPlates
              content={contents}
              width={width}
              rows={currentVessel.rows}
              cols={currentVessel.cols}
              showName={currentVessel.showName}
              showNumber={currentVessel.showNumber}
            />
          );
        case 'Wafer':
          return <Wafers width={width} size={currentVessel.size} />;
        default:
          return;
      }
    }
  };

  return (
    <Card ref={ref}>
      <div className="d-flex align-items-center common-border">
        <button
          className="btn btn-light btn-sm"
          style={{ width: '50%' }}
          onClick={() => changeVesselSeries(false)}
        >
          <Icon
            size={0.9}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiChevronLeft}
          ></Icon>
        </button>
        <button
          className="btn btn-light btn-sm"
          style={{ width: '50%' }}
          onClick={() => changeVesselSeries(true)}
        >
          <Icon
            size={0.9}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiChevronRight}
          ></Icon>
        </button>
      </div>
      <div className="d-flex common-border">
        <h6 className="mb-0">
          {' '}
          {currentVessel.title} - {currentVessel.type}
        </h6>
      </div>
      {renderVessel()}
      {showSelectDialog && (
        <SelectDialog
          currentVessel={currentVesselId}
          open={showSelectDialog}
          closeDialog={() => {
            setShowSelectDialog(false);
          }}
          changeVessel={(id) => {
            setCurrentVesselStatus(id);
          }}
        />
      )}
      {showExpansionDialog && (
        <ExpansionDialog
          currentVessel={currentVesselId}
          open={showExpansionDialog}
          areaPercentage={measureData.vessel_data.area_percentage}
          closeDialog={(percentVal) => {
            handleExpansionDialogClose(percentVal);
          }}
        />
      )}
      <div className="d-flex justify-content-around align-items-center common-border">
        <button
          className="btn btn-light btn-sm"
          style={{ width: '50%' }}
          onClick={() => setShowSelectDialog(true)}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiSyncAlert}
          ></Icon>
        </button>
        <button
          className="btn btn-light btn-sm"
          style={{ width: '50%' }}
          onClick={() => setShowExpansionDialog(true)}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiImageFilterCenterFocus}
          ></Icon>
        </button>
      </div>
    </Card>
  );
};

export default connect(mapStateToProps)(Vessel);
