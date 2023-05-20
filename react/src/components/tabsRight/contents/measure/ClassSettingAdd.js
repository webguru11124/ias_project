import * as React from 'react';
import { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@material-ui/core';
// import Select from '@mui/material/Select';
import { Select } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Add } from '@material-ui/icons';

export default function ClassSettingItemAddRow(props) {
  const { onAdd } = props;
  const [className, setClassName] = useState('');
  const [channelId, setChannelId] = useState(-1);
  const [parentId, setParentId] = useState(-1);

  const handleAdd = () => {
    onAdd({ className, channelId, parentId });
    setClassName('');
    setChannelId(-1);
    setParentId(-1);
  };

  return (
    <TableRow>
      <TableCell>
        <TextField
          label={''}
          variant="outlined"
          size="small"
          inputProps={{
            style: { padding: '8px 4px', fontSize: '14px', minWidth: '40px' },
          }}
          value={className}
          onChange={(e) => {
            setClassName(e.target.value);
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Select
          native
          label={'Channel'}
          value={channelId}
          inputProps={{
            style: { border: '2px solid #ccc', borderRadius: '4px' },
          }}
          onChange={(e) => setChannelId(e.target.value)}
        >
          <option value={-1}></option>
          <option value={0}>S</option>
          <option value={1}>B</option>
          <option value={2}>G</option>
          <option value={3}>R</option>
          <option value={4}>C</option>
          <option value={5}>Y</option>
          <option value={6}>M</option>
        </Select>
      </TableCell>
      <TableCell align="right">
        <Select
          native
          label={'Parent'}
          value={parentId}
          inputProps={{
            style: { border: '2px solid #ccc', borderRadius: '4px' },
          }}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value={-1}>None</option>
          <option value={0}>S</option>
          <option value={1}>B</option>
          <option value={2}>G</option>
          <option value={3}>R</option>
          <option value={4}>C</option>
          <option value={5}>Y</option>
          <option value={6}>M</option>
        </Select>
      </TableCell>
      <TableCell>
        <IconButton color="primary" size={'small'} onClick={handleAdd}>
          <Add />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
