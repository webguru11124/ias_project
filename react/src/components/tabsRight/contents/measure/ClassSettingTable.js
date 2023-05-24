import * as React from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import Select from '@mui/material/Select';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import ClassSettingItemAddRow from './ClassSettingAdd';
import store from '@/reducers';
import Button from '@mui/material/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import '@/styles/measure.css';

const channels = ['S', 'B', 'G', 'R', 'C', 'Y', 'M'];

export default function ClassSettingTable() {
  const channelData = useSelector((state) => state.measure.channel_data);
  // console.log('class setting', channelData)

  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );

  const [className, setClassName] = useState('class1');
  const [channelId, setChannelId] = useState(-1);
  const [parentId, setParentId] = useState(-1);

  const onAdd = () => {
    const payload = {
      className,
      channelId,
      parentId,
    };
    if (className === '') return;
    // console.log('classs setting======>', classSettingData, )
    if (
      classSettingData &&
      classSettingData.indexOf((it) => it.className == className) > 0
    )
      return;
    store.dispatch({
      type: 'ADD_MEASURE_CLASS_SETTING',
      payload: payload,
    });
    const len = classSettingData.length ?? 0;
    // if (len == 0) len++;
    setClassName(`class${len + 2}`);
    setChannelId(-1);
    setParentId(-1);
  };

  const onDelete = () => {
    let cLen = classSettingData.length;
    if (cLen == 0) return;
    const item = classSettingData[cLen - 1];
    store.dispatch({
      type: 'DELETE_MEASURE_CLASS_SETTING',
      payload: item,
    });
  };

  const handleSelect = (item) => {};

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '300px' }}>
      <Table aria-label="caption table" size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell size="small" padding="none">
              Class
            </TableCell>
            <TableCell size="small" padding="none">
              Channel
            </TableCell>
            <TableCell size="small" padding="none">
              Parent
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ClassSettingItemAddRow
            channelData={channelData}
            className={className}
            channelId={channelId}
            parentId={parentId}
            setClassName={setClassName}
            setParentId={setParentId}
            setChannelId={setChannelId}
          />
          {classSettingData.length ? (
            classSettingData.map((row) => (
              <TableRow
                key={row.name}
                onClick={() => handleSelect(row)}
                padding="none"
              >
                <TableCell component="th" scope="row">
                  {row.className}
                </TableCell>
                <TableCell align="right">{channels[row.channelId]}</TableCell>
                <TableCell align="right">
                  {row.parentId === -1 ? 'None' : channels[row.parentId]}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
      <div className="m-0 border class-setting-btn-container">
        <Button
          variant="contained"
          size="small"
          className="class-setting-btn"
          sx={{ padding: '0px', color: '#0F9688' }}
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add
        </Button>
        <Button
          variant="contained"
          size="small"
          className="class-setting-btn"
          sx={{ padding: '0px' }}
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Erase
        </Button>
      </div>
    </TableContainer>
  );
}
