import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@material-ui/core';
// import Select from '@mui/material/Select';
import { Select } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Add } from '@material-ui/icons';

export default function ClassSettingItemAddRow(props) {
  const {
    channelData,
    setClassName,
    setChannelId,
    setParentId,
    className,
    channelId,
    parentId,
  } = props;
  const [channelList, setChannelList] = useState(channelData);
  useEffect(() => {
    setChannelList(channelData);
  }, [channelData]);

  // console.log('channel data', channelData)
  // console.log('channel list=====>', channelList)
  return (
    <TableRow>
      <TableCell size="small" padding="none" sx={{ width: '30%' }}>
        <TextField
          label={''}
          variant="outlined"
          size="small"
          inputProps={{
            style: { padding: '8px 4px', fontSize: '14px' },
          }}
          value={className}
          onChange={(e) => {
            setClassName(e.target.value);
          }}
        />
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        sx={{ width: '30%', paddingLeft: '3%' }}
      >
        <Select
          native
          label={'Channel'}
          value={channelId}
          inputProps={{
            style: { borderRadius: '4px', width: '100%' },
          }}
          onChange={(e) => setChannelId(e.target.value)}
        >
          <option value={-1}></option>
          {channelList.length > 0 &&
            channelList.map((ch) => {
              // console.log('channel List====>', ch)
              if (ch.id >= 0) return <option value={ch.id}>{ch.symbol}</option>;
            })}
          {/* // <option value={0}>S</option>
          // <option value={1}>B</option>
          // <option value={2}>G</option>
          // <option value={3}>R</option>
          // <option value={4}>C</option>
          // <option value={5}>Y</option>
          // <option value={6}>M</option> */}
        </Select>
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        sx={{ width: '30%', paddingLeft: '3%' }}
      >
        <Select
          native
          label={'Parent'}
          value={parentId}
          inputProps={{
            style: { borderRadius: '4px' },
          }}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value={-1}>None</option>
          {channelList.length > 0 &&
            channelList.map((ch) => {
              // console.log('channel List====>', ch)
              if (ch.id >= 0) return <option value={ch.id}>{ch.symbol}</option>;
            })}
          {/* <option value={0}>S</option>
          <option value={1}>B</option>
          <option value={2}>G</option>
          <option value={3}>R</option>
          <option value={4}>C</option>
          <option value={5}>Y</option>
          <option value={6}>M</option> */}
        </Select>
      </TableCell>
    </TableRow>
  );
}
