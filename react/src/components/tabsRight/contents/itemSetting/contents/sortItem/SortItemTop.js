import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Icon from '@mdi/react';
import {
  mdiNoteMultipleOutline,
  mdiArrowLeftRight,
  mdiArrowUpDown,
} from '@mdi/js';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import Tab from '@mui/material/Tab';

export default function SortItemTop(props) {
  const [value, setValue] = React.useState('');
  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );

  const [currentData, setCurrentData] = React.useState({});
  const [currentClass, setCurrentClass] = React.useState(-1);
  const [measureItems, setMeasureItems] = React.useState([]);
  const [currentMeasureItem, setCurrentMeasureItem] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const options = Array.from(Array(31).keys());

  const handleChangeClass = (e, newValue) => {
    setCurrentClass(e.target.value);
    setMeasureItems(classSettingData[e.target.value].selectedItems);
    props.onChangeClass(e.target.value);
  };

  const handleChangeMeasureItem = (e, newValue) => {
    setCurrentMeasureItem(e.target.value);
    props.onChangeMeasure(e.target.value);
  };

  return (
    <Container sx={{ marginBottom: '16px' }}>
      <Grid
        container
        spacing={2}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Grid item xs={2}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel labelid="measure-class-label">Class</InputLabel>
            <Select
              labelid="measure-class-label"
              id="my-select"
              value={currentClass}
              onChange={handleChangeClass}
            >
              {classSettingData.length ? (
                classSettingData.map((row, index) => (
                  <MenuItem value={index} key={index}>
                    {row.className}
                  </MenuItem>
                ))
              ) : (
                <></>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl sx={{ width: '100%' }}>
            {/* <FormControl sx={{ width: "250px" }}></FormControl> */}
            <InputLabel labelid="measure-selected-item-label">
              Measure Selected Item
            </InputLabel>
            <Select
              labelid="measure-selected-item-label"
              id="measure-selected-item"
              value={currentMeasureItem}
              onChange={handleChangeMeasureItem}
            >
              {measureItems.map((row, index) => (
                <MenuItem value={row} key={index}>
                  {row}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel labelid="bins-label">Bins</InputLabel>
            <Input type="number" />
          </FormControl>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex' }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiNoteMultipleOutline}
            ></Icon>
          </Button>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex' }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiArrowLeftRight}
            ></Icon>
          </Button>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex' }}>
          <Button>
            <Icon
              size={1}
              horizontal
              vertical
              rotate={180}
              color="#000000de"
              path={mdiArrowUpDown}
            ></Icon>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
