import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import SmallCard from '../../../custom/SmallCard';
import MeasureItemDialog from '../itemSetting/MeasureItemDialog';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import {
  classSettingColumns,
  classSettingRows,
} from '@/constants/class-setting';
import SortAreaDialog from '../itemSetting/SortAreaDialog';
import ClassSettingTable from './ClassSettingTable';
import * as api_measure from '@/api/measure';
import store from '@/reducers';

export default function ClassSettingPage() {
  const [showMeasureItemDialog, setShowMeasureItemDialog] = useState(false);
  const [showSortAreaDialog, setShowSortAreaDialog] = useState(false);
  const measureData = useSelector((state) => state.measure);
  const imagePathForOrigin = useSelector(
    (state) => state.files.imagePathForOrigin,
  );
  const imagePathForResult = useSelector(
    (state) => state.files.imagePathForResult,
  );

  const handleGo = async () => {
    let res = await api_measure.uploadMeasureData(measureData);
  };
  const handleStop = () => {};
  const handleSave = async () => {
    let res = await api_measure.uploadMeasureData(measureData);
  };
  const handleCancel = () => {};

  const openSortArea = () => {
    store.dispatch({
      type: 'set_image_path_for_avivator',
      content: imagePathForResult,
    });
    // setShowSortAreaDialog(true);
    store.dispatch({
      type: 'UPDATE_SORT_AREA_DIALOG_STATUS',
      payload: true,
    });
  };

  return (
    <>
      <SmallCard title="Class Setting">
        <Box sx={{ maxHeight: 360, width: '100%' }}>
          <ClassSettingTable />
          {/* <DataGrid
            rows={classSettingRows}
            columns={classSettingColumns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            // checkboxSelection
            disableSelectionOnClick
          /> */}
        </Box>
      </SmallCard>
      <SmallCard title="Measure Contents">
        <MeasureItemDialog />
        <SortAreaDialog />
        <Button
          className="btn btn-light btn-sm"
          style={{ width: '49%' }}
          onClick={() => {
            store.dispatch({
              type: 'UPDATE_MEASURE_ITEM_POPUP_STATUS',
              payload: true,
            });
          }}
        >
          Measure item
        </Button>
        <Button
          className="btn btn-light btn-sm"
          style={{ width: '49%' }}
          onClick={() => {
            openSortArea();
          }}
        >
          Sort area
        </Button>
        {/* <Button className="btn btn-light btn-sm w-16" onClick={onClick1}>
          Mi
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick2}>
          Ss
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick3}>
          S
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick4}>
          C
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick5}>
          L
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={onClick6}>
          S
        </Button> */}
      </SmallCard>
      <SmallCard title="Method Save">
        <Button className="btn btn-light btn-sm" style={{ width: '49%' }}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm" style={{ width: '49%' }}>
          Save as
        </Button>
      </SmallCard>
      <SmallCard title="Go">
        <Button className="btn btn-light btn-sm w-3/12" onClick={handleGo}>
          Go
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={handleStop}>
          Stop
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={handleSave}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm w-3/12" onClick={handleCancel}>
          Cancel
        </Button>
      </SmallCard>
      <p className="mt-4">Time remain</p>
      {/* <SmallCard title=""></SmallCard> */}
    </>
  );
}
