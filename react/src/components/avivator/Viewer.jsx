import React, { useEffect, useMemo } from 'react';
import shallow from 'zustand/shallow';
import debounce from 'lodash/debounce';
import {
  SideBySideViewer,
  VolumeViewer,
  AdditiveColormapExtension,
  LensExtension,
  DETAIL_VIEW_ID,
  getDefaultInitialViewState,
} from '@hms-dbmi/viv';
import { connect } from 'react-redux';
import {
  useImageSettingsStore,
  useViewerStore,
  useChannelsStore,
  useLoader,
} from '@/state';
import { useWindowSize } from '@/helpers/avivator';
import { DEFAULT_OVERVIEW } from '@/constants';
import { PostProcessEffect } from '@deck.gl/core';
import generateShaderModule from '@/helpers/generate-module';
import CustomPaletteExtension from './extensions/custom-palette-extension';
import CustomPipViewer from './viewers/CustomPipViewer';
import store from '@/reducers';

const Viewer = (props, { isFullScreen }) => {
  const { useLinkedView, use3d, viewState, setViewState } = useViewerStore(
    (state) => state,
    shallow,
  );
  let {
    colors,
    contrastLimits,
    brightness,
    contrast,
    gamma,
    deblur,
    inputNum_1,
    inputNum_2,
    channelsVisible,
    selections,
    selectedChannel,
  } = useChannelsStore((state) => state, shallow);
  const {
    lensSelection,
    colormap,
    renderingMode,
    xSlice,
    ySlice,
    zSlice,
    resolution,
    lensEnabled,
    zoomLock,
    panLock,
    isOverviewOn,
    onViewportLoad,
    useFixedAxis,
  } = useImageSettingsStore((store) => store, shallow);

  const loader = useLoader();
  const shaderModule = useMemo(
    // const centerCoors = viewState.target;
    () => generateShaderModule(Math.floor(deblur.size / 2), deblur.filterIndex),
    [deblur],
  );
  let target = viewState.target;
  if (typeof target === 'undefined') {
    target = [255, 255];
  }
  const element = document.getElementById('deckgl-overlay');
  let canvasWH = [100, 100];
  if (element != null) {
    canvasWH = [element.width, element.height];
  }

  const currentChannel = selectedChannel === -1 ? 0 : selectedChannel;
  brightness = brightness[currentChannel];
  contrast = contrast[currentChannel];
  gamma = gamma[currentChannel];

  const postProcessEffect = useMemo(
    () =>
      new PostProcessEffect(shaderModule, {
        u_brightness: brightness,
        u_contrast: contrast,
        u_gamma: gamma,
        u_deblurKernel: deblur.kernel,
        u_Slice: [xSlice[1], ySlice[1]],
        u_target: target,
        u_zoom: viewState.zoom,
        u_iterNum: [inputNum_1, inputNum_2],
        disWH: [
          localStorage.getItem('imageViewSizeWidth'),
          localStorage.getItem('imageViewSizeHeight'),
        ],
        canWH: canvasWH,
      }),
    [brightness, contrast, gamma, deblur, target, shaderModule],
  );
  const viewSize = useWindowSize(isFullScreen, 1, 1);

  useEffect(() => {
    const initialViewState = getDefaultInitialViewState(loader, viewSize);

    //console.log(initialViewState);
    setViewState(initialViewState);
    //console.log(viewState);
    // console.log('zoom', initialViewState.zoom);
    let deck_width = localStorage.getItem('imageViewSizeWidth');
    let deck_height = localStorage.getItem('imageViewSizeHeight');
    // console.log(`Width: ${width} Height: ${height}`)
    const state = store.getState();
    let canvas_info = state.experiment.canvas_info;
    let canvas_save = {
      ...canvas_info,
      width: loader[0].shape[4],
      height: loader[0].shape[3],
      zoom: initialViewState.zoom,
      top:
        deck_height / 2 -
        initialViewState.target[1] * Math.pow(2, initialViewState.zoom),
      left:
        deck_width / 2 -
        initialViewState.target[0] * Math.pow(2, initialViewState.zoom),
    };
    localStorage.setItem(
      'CANV_TOP',
      deck_height / 2 -
        initialViewState.target[1] * Math.pow(2, initialViewState.zoom),
    );
    localStorage.setItem(
      'CANV_LEFT',
      deck_width / 2 -
        initialViewState.target[0] * Math.pow(2, initialViewState.zoom),
    );
    localStorage.setItem('CANV_ZOOM', initialViewState.zoom);
    store.dispatch({
      type: 'set_canvas',
      content: canvas_save,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // const initialViewState = getDefaultInitialViewState(loader, viewSize);
    // let imgWidth = loader[0].shape[4];
    // let imgHeight = loader[0].shape[3];
    // let deck_width = localStorage.getItem('imageViewSizeWidth');
    // let deck_height = localStorage.getItem('imageViewSizeHeight');
    // let zoom = localStorage.getItem('CANV_ZOOM');
    // const { selectedVessel } = props;
    // let r = selectedVessel.row;
    // let c = selectedVessel.col - 1;
    // if (
    //   selectedVessel.colCount == 0 ||
    //   selectedVessel.colCount == undefined ||
    //   selectedVessel.rowCount == 0 ||
    //   selectedVessel.rowCount == undefined
    // ) {
    //   return;
    // }
    // let unitW = imgWidth / selectedVessel.colCount;
    // let unitH = imgHeight / selectedVessel.rowCount;
    // let x = (c + 0.5) * unitW;
    // let y = (r + 0.5) * unitH;
    // setViewState({
    //   ...viewState,
    //   target: [x, y],
    // });
  }, [props.selectedVessel]);

  const onViewStateChange = ({ viewState }) => {
    //console.log(`X-${viewState.target[0]} Y:${viewState.target[1]}`);

    let deck_width = localStorage.getItem('imageViewSizeWidth');
    let deck_height = localStorage.getItem('imageViewSizeHeight');
    // console.log(`Width: ${width} Height: ${height}`)
    const state = store.getState();

    let canvas_info = state.experiment.canvas_info;
    let canvas_save = {
      ...canvas_info,
      zoom: viewState.zoom,
      top: deck_height / 2 - viewState.target[1] * Math.pow(2, viewState.zoom),
      left: deck_width / 2 - viewState.target[0] * Math.pow(2, viewState.zoom),
    };
    localStorage.setItem(
      'CANV_TOP',
      deck_height / 2 - viewState.target[1] * Math.pow(2, viewState.zoom),
    );
    localStorage.setItem(
      'CANV_LEFT',
      deck_width / 2 - viewState.target[0] * Math.pow(2, viewState.zoom),
    );
    localStorage.setItem('CANV_ZOOM', viewState.zoom);
    store.dispatch({
      type: 'set_canvas',
      content: canvas_save,
    });
    const { zoom } = viewState;
    const z = Math.min(Math.max(Math.round(-zoom), 0), loader.length - 1);
    useViewerStore.setState({ pyramidResolution: z, viewState });
  };
  return use3d ? (
    <VolumeViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      colormap={colormap}
      xSlice={xSlice}
      ySlice={ySlice}
      zSlice={zSlice}
      resolution={resolution}
      renderingMode={renderingMode}
      height={viewSize.height}
      width={viewSize.width}
      onViewportLoad={onViewportLoad}
      useFixedAxis={useFixedAxis}
      viewStates={[viewState]}
      onViewStateChange={debounce(
        ({ viewState: newViewState, viewId }) =>
          useViewerStore.setState({
            viewState: { ...newViewState, id: viewId },
          }),
        250,
        { trailing: true },
      )}
    />
  ) : useLinkedView ? (
    <SideBySideViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      zoomLock={zoomLock}
      panLock={panLock}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[
        colormap ? new AdditiveColormapExtension() : new LensExtension(),
      ]}
      colormap={colormap || 'viridis'}
    />
  ) : (
    <CustomPipViewer
      loader={loader}
      contrastLimits={contrastLimits}
      parameters={{
        brightness,
        contrast,
        gamma,
      }}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      overview={DEFAULT_OVERVIEW}
      overviewOn={isOverviewOn}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[new CustomPaletteExtension()]}
      colormap={colormap || 'viridis'}
      viewStates={[{ ...viewState, id: DETAIL_VIEW_ID }]}
      onViewStateChange={onViewStateChange}
      deckProps={{
        effects: [postProcessEffect],
      }}
    />
  );
};

// Viewer.PropTypes = {
//   selectedVessel: PropTypes.number
// };

const mapStateToProps = (state) => ({
  selectedVessel: state.vessel.selectedVesselHole,
});

export default connect(mapStateToProps)(Viewer);
