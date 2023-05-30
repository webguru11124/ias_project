import React, { useEffect, useRef, useState } from 'react';
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
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export default function SortItemBottom(props) {
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [originMinValue, setOriginMinValue] = useState('');
  const [originMaxValue, setOriginMaxValue] = useState('');
  const [isActive, setIsActive] = useState(true);
  const classSettingData = useSelector(
    (state) => state.measure.class_setting_data,
  );
  const measureData = useSelector((state) => state.measure.ml_measure_data);
  const chart = useRef();

  // const data = [[1, 22.56], [2, 21.67], [3, 21.66], [4, 21.81], [5, 21.28], [6, 20.05], [6, 19.98], [7, 18.26], [8, 19.16], [9, 20.13], [10, 18.72]];
  const data = [];

  const afterSetExtremes = (e) => {
    setMinValue(e.min);
    setMaxValue(e.max);
  };

  const [chartConfig, setChartConfig] = useState({
    rangeSelector: {
      selected: 1,
    },
    chart: {
      type: 'column',
    },
    series: [
      {
        data: data,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
    xAxis: {
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      events: {
        afterSetExtremes: afterSetExtremes,
      },
      minRange: 1,
    },
    navigator: {
      xAxis: {
        min: 1,
      },
    },
  });

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
      setOriginMaxValue(max);
      setOriginMinValue(min);
      let count = Math.round((max - min) / props.currentBins);
      let data = [];
      for (let i = 0; i <= count; i++) {
        data.push([min + i * props.currentBins, 0]);
      }
      for (let i = 0; i < measureData[props.currentClass].data.length; i++) {
        let value = measureData[props.currentClass].data[i][index] * 1;
        let di = Math.round((value - min) / props.currentBins);
        data[di][1]++;
      }
      // let config = chartConfig;
      // config.series[0].data = data;
      // setChartConfig(config);
      setChartConfig({
        series: {
          data: data,
        },
      });
    }
  }, [props]);

  // useEffect(() => {
  //   console.log('min-max-value-change');
  //   let config = chartConfig;
  //   config.navigator.xAxis.min = minValue;
  //   setChartConfig(config);
  // }, [minValue, maxValue])

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
    chart.current.chart.xAxis[0].setExtremes(event.target.value, maxValue);
  };

  const maxHandleChange = (event) => {
    setMaxValue(event.target.value);
    chart.current.chart.xAxis[0].setExtremes(minValue, event.target.value);
  };

  const handleIsActiveChange = (event) => {
    setIsActive(!isActive);
  };

  const resetRange = () => {
    setMinValue(originMinValue);
    setMaxValue(originMaxValue);
    chart.current.chart.xAxis[0].setExtremes(originMinValue, originMaxValue);
  };

  return (
    <Container>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartConfig}
        constructorType={'stockChart'}
        ref={chart}
      />
      <Grid container spacing={2}>
        <Grid item xs={2} sx={{ display: 'flex' }}>
          <FormControlLabel
            control={
              <Checkbox checked={isActive} onChange={handleIsActiveChange} />
            }
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
            <Input
              type="number"
              value={minValue}
              onChange={minHandleChange}
              id="inputMin"
              disabled={!isActive}
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={resetRange}
          >
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
            <Input
              type="number"
              value={maxValue}
              onChange={maxHandleChange}
              id="inputMax"
              disabled={!isActive}
            />
          </FormControl>
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={applyFilter}
            disabled={!isActive}
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
