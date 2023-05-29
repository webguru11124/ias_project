import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import debounce from 'lodash/debounce';
import shallow from 'zustand/shallow';

import { range, getMultiSelectionStats } from '@/helpers/avivator';
import {
  useChannelsStore,
  useViewerStore,
  useImageSettingsStore,
  useLoader,
} from '@/state';
import store from '@/reducers';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  display: state.display,
  content: state.files.content,
});

function ZPosition(props) {
  const loader = useLoader();
  const { shape, labels } = loader[0];
  const size = shape[labels.indexOf('z')];
  const [zvalue, setZvalue] = useState(
    useViewerStore((store) => store.globalSelection.z),
  );

  const { selections, setPropertiesForChannel } = useChannelsStore(
    (store) => store,
    shallow,
  );
  const globalSelection = useViewerStore((store) => store.globalSelection);
  const zpositionData = useSelector((state) => state.measure.zposition);

  useEffect(() => {
    if (props.content) {
      if (
        props.content[0] &&
        props.content[0].z !== undefined &&
        Number(props.content[0].z) === 0
      ) {
        useViewerStore.setState({
          globalSelection: { ...globalSelection, z: 1 },
        });
        setZvalue(1);
      }
    }
  }, [props]);

  // eslint-disable-next-line
  const changeSelection = useCallback(
    debounce(
      (_event, newValue) => {
        useViewerStore.setState({
          isChannelLoading: selections.map(() => true),
        });
        // ** update the z position value ** QmQ
        store.dispatch({
          type: 'UPDATE_MEASURE_ZPOSITION',
          payload: { z: newValue },
        });

        const newSelections = [...selections].map((sel) => ({
          ...sel,
          z: newValue,
        }));
        getMultiSelectionStats({
          loader,
          selections: newSelections,
          use3d: false,
        }).then(({ domains, contrastLimits }) => {
          range(newSelections.length).forEach((channel, j) =>
            setPropertiesForChannel(channel, {
              domains: domains[j],
              contrastLimits: contrastLimits[j],
            }),
          );
          useImageSettingsStore.setState({
            onViewportLoad: () => {
              useImageSettingsStore.setState({
                onViewportLoad: () => {},
              });
              useViewerStore.setState({
                isChannelLoading: selections.map(() => false),
              });
            },
          });
          range(newSelections.length).forEach((channel, j) =>
            setPropertiesForChannel(channel, {
              selections: newSelections[j],
            }),
          );
        });
      },
      50,
      { trailing: true },
    ),
    [loader, selections, setPropertiesForChannel],
  );

  return (
    <Grid container sx={{ p: 1 }}>
      <Grid item xs={12}>
        <Box component="h6">Z Position</Box>
      </Grid>
      <Grid item xs={12} sx={{ px: 1, pt: 1 }}>
        <Slider
          value={globalSelection.z}
          defaultValue={1}
          onChange={(event, newValue) => {
            useViewerStore.setState({
              globalSelection: {
                ...globalSelection,
                z: newValue,
              },
            });
            if (event.type === 'keydown') {
              changeSelection(event, newValue);
            }
          }}
          valueLabelDisplay="auto"
          onChangeCommitted={changeSelection}
          marks={range(size).map((val) => ({ value: val }))}
          min={0}
          max={size}
          orientation="horizontal"
        />
      </Grid>
    </Grid>
  );
}
export default connect(mapStateToProps)(ZPosition);
