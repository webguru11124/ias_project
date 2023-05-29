import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';
import store from '@/reducers';

export default function SortItemBottom(props) {
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );
  const measureData = useSelector((state) => state.measure.ml_measure_data);

  useEffect(() => {
    if (props.currentClass != -1 && props.currentMeasureItem) {
      let selectedItems = classSettingData[props.currentClass].selectedItems;
      let index = selectedItems.indexOf(props.currentMeasureItem) + 1;
      let min = measureData[props.currentClass].data[0][index] * 1;
      let max = measureData[props.currentClass].data[0][index] * 1;
      for (let i = 1; i < measureData[props.currentClass].data.length; i++) {
        if (min * 1 > measureData[props.currentClass].data[i][index] * 1) {
          min = measureData[props.currentClass].data[i][index] * 1;
        }
        if (max * 1 < measureData[props.currentClass].data[i][index] * 1) {
          max = measureData[props.currentClass].data[i][index] * 1;
        }
      }
      setMinValue(min);
      setMaxValue(max);
    }
  }, [props]);

  const applyFilter = () => {
    if (props.currentClass != -1 && props.currentMeasureItem) {
      let newData = [].concat(measureData);
      let data = [];
      if (minValue !== '' && maxValue !== '') {
        let selectedItems = classSettingData[props.currentClass].selectedItems;
        let index = selectedItems.indexOf(props.currentMeasureItem) + 1;
        for (let i = 0; i < measureData[props.currentClass].data.length; i++) {
          if (
            minValue * 1 >
            measureData[props.currentClass].data[i][index] * 1
          ) {
            continue;
          }
          if (
            maxValue * 1 <
            measureData[props.currentClass].data[i][index] * 1
          ) {
            continue;
          }
          data.push(measureData[props.currentClass].data[i]);
        }
        newData[props.currentClass].data = data;
        store.dispatch({
          type: 'SET_ML_MEASURE_DATA',
          payload: newData,
        });
      }
    }
  };

  const minHandleChange = (event) => {
    setMinValue(event.target.value);
  };

  const maxHandleChange = (event) => {
    setMaxValue(event.target.value);
  };

  const minOptions = Array.from(Array(31).keys());

  const maxOptions = Array.from(Array(31).keys());

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={2} sx={{ display: 'flex' }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Active"
            sx={{ marginBottom: '0' }}
          />
        </Grid>
        <Grid
          item
          xs={7}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ margin: '0' }}>Min</p>
          <FormControl sx={{ width: '90%' }}>
            <Input type="number" value={minValue} onChange={minHandleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="inherit" size="small">
            Reset
          </Button>
        </Grid>
        <Grid
          item
          xs={7}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ margin: '0' }}>Max</p>
          <FormControl sx={{ width: '90%' }}>
            <Input type="number" value={maxValue} onChange={maxHandleChange} />
          </FormControl>
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={applyFilter}
          >
            Apply Filter
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="inherit" size="small">
            ROI
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="inherit" size="small">
            Cancel
          </Button>
        </Grid>
        <Grid item xs={8}></Grid>
      </Grid>
    </Container>
  );
}
