import * as React from 'react';
import { useSelector } from 'react-redux';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import LightModeIcon from '@mui/icons-material/LightMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import { useChannelsStore } from '@/state';
import styled from '@emotion/styled';
import store from '@/reducers';

const PARAMS = [
  {
    name: 'brightness',
    icon: BrightnessLowIcon,
    default: 0,
    min: -1,
    max: 1,
    step: 0.1,
  },
  {
    name: 'contrast',
    icon: ContrastIcon,
    default: 0,
    min: -1,
    max: 1,
    step: 0.1,
  },
  {
    name: 'gamma',
    icon: LightModeIcon,
    default: 50,
    min: 0,
    max: 100,
    step: 0.1,
  },
];

const ParamItem = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function ImageAdjust() {
  const channelState = useChannelsStore((state) => state);
  const imageAdjustData = useSelector(
    (state) => state.measure.image_adjust_data,
  );
  const { setPropertiesForChannel, selectedChannel: channel } = channelState;

  const handleSlide = (event, newValue) => {
    let specificField = imageAdjustData[[event.target.name]];
    specificField[[channel]] = newValue ? Number(newValue) : 0;
    store.dispatch({
      type: 'UPDATE_MEASURE_IMAGE_ADJUST_DATA',
      payload: {
        [event.target.name]: specificField,
      },
    });
    setPropertiesForChannel(channel, {
      [event.target.name]: newValue ? Number(newValue) : 0,
    });
  };
  const handleInput = (event) => {
    const newValue = Number(event.target.value);
    let specificField = imageAdjustData[[event.target.name]];
    specificField[[channel]] = newValue;

    store.dispatch({
      type: 'UPDATE_MEASURE_IMAGE_ADJUST_DATA',
      payload: {
        [event.target.name]: specificField,
      },
    });
    setPropertiesForChannel(channel, { [event.target.name]: newValue ?? 0 });
  };

  return (
    <Box mb={1}>
      <Typography variant="card-title" gutterBottom mx={1}>
        Image Adjust
      </Typography>
      <Grid container>
        {PARAMS.map((param) => (
          <React.Fragment key={param.name}>
            <ParamItem item xs={2}>
              <IconButton
                size="small"
                disabled={channel < 0}
                onClick={() =>
                  setPropertiesForChannel(channel, {
                    [param.name]: param.default,
                  })
                }
              >
                <param.icon fontSize="1rem" />
              </IconButton>
            </ParamItem>
            <ParamItem item xs={7}>
              <Slider
                name={param.name}
                sx={{ py: 1 }}
                value={channelState[param.name][channel] ?? param.default}
                disabled={channel < 0}
                onChange={handleSlide}
                min={param.min}
                max={param.max}
                step={param.step}
                size="small"
              />
            </ParamItem>
            <ParamItem item xs={3}>
              <InputBase
                name={param.name}
                value={channelState[param.name][channel] ?? param.default}
                disabled={channel < 0}
                size="small"
                onChange={handleInput}
                inputProps={{
                  step: param.step,
                  min: param.min,
                  max: param.max,
                  type: 'number',
                  style: { textAlign: 'center', padding: 0, height: 'unset' },
                }}
              />
            </ParamItem>
          </React.Fragment>
        ))}
      </Grid>
      <Divider />
    </Box>
  );
}
