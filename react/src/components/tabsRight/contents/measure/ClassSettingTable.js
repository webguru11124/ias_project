import * as React from 'react';
import { useSelector } from 'react-redux';
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

const channels = ['S', 'B', 'G', 'R', 'C', 'Y', 'M'];

export default function AccessibleTable() {
  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );

  const onAdd = (item) => {
    store.dispatch({
      type: 'ADD_MEASURE_CLASS_SETTING',
      payload: item,
    });
  };

  const onDelete = (item) => {
    store.dispatch({
      type: 'DELETE_MEASURE_CLASS_SETTING',
      payload: item,
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="caption table" size={'small'}>
        <caption>Class Setting Table</caption>
        <TableHead>
          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell align="right">Channel</TableCell>
            <TableCell align="right">Parent</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ClassSettingItemAddRow onAdd={onAdd} />
          {classSettingData.length ? (
            classSettingData.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.className}
                </TableCell>
                <TableCell align="right">{channels[row.channelId]}</TableCell>
                <TableCell align="right">
                  {row.parentId === -1 ? 'None' : channels[row.parentId]}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    size={'small'}
                    onClick={() => onDelete(row)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
