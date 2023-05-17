import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ScrollArea from 'react-scrollbar';
import DialogPM from '../../DialogPM';
import Icon from '@mdi/react';
import { mdiWeatherSunny, mdiCropFree, mdiClose, mdiPencil } from '@mdi/js';
import { connect } from 'react-redux';
import * as api_tiles from '../../../../../../api/tiles';
import { getImageByUrl } from '../../../../../../api/fetch';
import RoutedAvivator from '../../../../../avivator/Avivator';
import Vessel from '../../../../../tabsRight/contents/viewcontrol/Vessel';
import Objective from '../../../../../tabsRight/contents/viewcontrol/Objective';
import Channel from '../../../../../tabsRight/contents/viewcontrol/Channel';
import ImageAdjust from '../../../../../tabsRight/contents/viewcontrol/ImageAdjust';
import ZPosition from '../../../../../tabsRight/contents/viewcontrol/ZPosition';
import Timeline from '../../../../../tabsRight/contents/viewcontrol/Timeline';
import store from '../../../../../../reducers';
import UTIF from 'utif';
import useTilingStore from '@/stores/useTilingStore';
import { TileSeriesDescription } from 'igniteui-react-core';
import { DialogActions, ImageList, ImageListItem, Paper } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import Avivator from '../../../../../avivator/Avivator';
import { Alignments, Directions, SortOrder } from './constants';
import useMetadata from '@/hooks/useMetadata';
import { useChannelsStore } from '@/state';
import {
  buildPyramid,
  correctionTiledImage,
  gammaTiledImage,
  normalizeTiledImage,
  snapToEdge,
} from '@/api/tiling';
import { Typography } from 'react-md';
import { loadOmeTiff } from '@hms-dbmi/viv';
import { createLoader } from './../../../../../../helpers/avivator';

const tilingMenus = [
  'Edit',
  'Alignment',
  'Bonding',
  'Shading',
  'Display',
  'Result',
  //'Option',
];

const tilingAlignButtons = [
  'Cascade',
  'Height Decreasing',
  'Height Increasing',
  'By XYZ',
  'By Columns',
  'By Rows',
];

const TAG = 'Tiling : ';
let stylingTiling = {
  ToggleButtonGroup: { margin: '0 auto', width: '22px', height: '22px' },
};

const TabTiling = (props) => {
  const { tiles } = useTilingStore();

  const [selectedImageFileIndex, setSelectedImageFileIndex] = useState(0);

  //tab left index
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [checked, setChecked] = useState(true);

  const [tilingBondingPatternMatch, setTilingBondingPatterMatch] =
    useState(false);

  //Parameters in Alignment UI
  const [alignRow, setAlignRow] = useState(1);
  const [alignCol, setAlignCol] = useState(tiles ? tiles.length : 1);
  const [alignBorder, setAlignBorder] = useState(0);
  const [alignGapX, setAlignGapX] = useState(0);
  const [alignGapY, setAlignGapY] = useState(0);
  const [align, setAlign] = useState(Alignments.raster);
  const [dir, setDir] = useState(Directions.horizontal);
  const [dim, setDim] = useState();
  const [sortOrder, setSortOrder] = useState(SortOrder.ascending);

  const [alignment, setAlignment] = useState('align');

  //parameters in bonding
  const [selectBondRadioIdx, setSelectBondRadioIdx] = useState('0');

  //Parameters in Shading UI
  const [gamma, setGamma] = useState(1);

  const canvasElement = useRef(null);

  const [displayTilingJpegImages, setDisplayTilingJpegImages] = useState(false);
  const [displayResultImage, setDisplayResultImage] = useState(false);

  const [resultImagePath, setResultImagePath] = useState('');

  const channelState = useChannelsStore((state) => state);

  //Logs
  const [infoMessage, setInfoMessage] = useState();

  //Get the image of ome tiff file extension from the original url
  const getOmeTiffUrl = (url) => {
    //console.log(tiles);
    const ext = url.split('.').pop();
    if (ext === 'tiff' || ext === 'tif') return url;
    const newExtension = 'ome.tiff';
    const newUrl = url.replace(/\.[^/.]+$/, `.${newExtension}`);
    return newUrl;
  };

  // urls list
  const urls = useMemo(
    () =>
      tiles
        .filter((tile) => /tif?f|jpg|jpeg|png|JPG|PNG/.test(tile.path))
        .map((img) => getOmeTiffUrl(img.url)),
    [tiles],
  );

  //Metadata
  const [metadata, loading] = useMetadata(urls);

  // When the tiles reload, set dim by default 1 * tiles.length()
  useEffect(() => {
    if (tiles) {
      setDim([1, tiles.length]);
      setResultImagePath(getOmeTiffUrl(tiles[0].url));
      setInfoMessage(`${tiles.length} images are loaded.`);

      let tile = tiles[0];
      if (tile.z || tile.row || tile.col || tile.series) {
        let newContent = [];
        let tempContent = {};
        const tempVal = tile.z;
        tempContent.z = tile.time;
        tempContent.time = tempVal;
        tempContent.dimensionChanged = tile.dimensionChanged;
        tempContent.row = tile.row;
        tempContent.col = tile.col;
        tempContent.series = tile.strSeries;
        newContent.push(tempContent);
        store.dispatch({ type: 'content_addContent', content: newContent });
      }
    }
  }, [tiles]);

  //Get the Temp Path from the server
  const getTempPath = () => {
    //Load an OME_TIFF file
    const filename = tiles[0].url.split('/').pop();
    const resultpath =
      tiles[0].url.replace(filename, '') + 'temp_output.ome.tiff';
    return resultpath;
  };

  //Get the result image path from the server
  const getResultPath = () => {
    //Load an OME_TIFF file
    const filename = tiles[0].url.split('/').pop();
    const resultpath = tiles[0].url.replace(filename, '') + 'result.ome.tiff';
    return resultpath;
  };

  //when the tiles loaded, return the sort tiles by field
  const sorted = useMemo(() => {
    if (sortOrder === SortOrder.ascending) {
      if (tiles.length > 0) {
        if (!tiles[0].field) return tiles;
      }
      return tiles.sort((a, b) => a.field.localeCompare(b.field));
    } else return tiles.sort((a, b) => b.field.localeCompare(a.field));
  }, [tiles]);

  // return tiles aligned in alignment function
  const tilesAligned = useMemo(() => {
    let sortedTiles;
    if (tiles.length > 1 && tiles[0].field) {
      if (sortOrder === SortOrder.ascending) {
        sortedTiles = sorted.sort((a, b) => a.field.localeCompare(b.field));
      } else
        sortedTiles = sorted.sort((a, b) => b.field.localeCompare(a.field));
    } else sortedTiles = sorted;

    if (!dim) {
      return sortedTiles;
    }

    const cols = dim[1];
    const rows = dim[0];
    let chunks = [];

    // if the direction is horizontal
    if (dir === Directions.horizontal) {
      for (let i = 0; i < sortedTiles.length; i += cols) {
        chunks.push(sortedTiles.slice(i, i + cols));
      }

      // Reverse every second sub-array for snake layout
      if (align === Alignments.snake) {
        for (let i = 1; i < chunks.length; i += 2) {
          chunks[i].reverse();
        }
      }
    } // if the direction is vertical
    else if (dir === Directions.vertical) {
      for (let i = 0; i < rows; i++) chunks.push([]);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const id = j * rows + i;
          chunks[i].push(sortedTiles.at(j * rows + i));
        }
      }

      if (align === Alignments.snake) {
        let temp = chunks;
        chunks = [];
        for (let i = 0; i < rows; i++) chunks.push([]);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (j % 2 === 1) {
              chunks[i][j] = temp[rows - i - 1][j];
            } else chunks[i][j] = temp[i][j];
          }
        }
      }
    }

    // Join the sub-arrays back together
    const temp = [].concat(...chunks);
    const result = [];
    temp.forEach((v) => {
      if (v !== undefined) {
        result.push(v);
      }
    });
    return result;
  }, [sorted, align, dir, dim, sortOrder]);

  // When the row is changed in alignment part
  const inputTilingRows = (event) => {
    let r = Number(event.target.value);
    if (r <= 0) r = 1;
    setAlignRow(event.target.value === '' ? '' : r);
    if (tiles) {
      if (tiles.length < r) {
        setAlignRow(tiles.length);
        setAlignCol(1);
        setDim([tiles.length, 1]);
      } else {
        let c = Math.ceil(tiles.length / r);
        setAlignCol(c);
        setDim([r, c]);
      }
    }
  };

  // When the col is changed in alignment part
  const inputTilingCols = (event) => {
    let c = Number(event.target.value);
    if (c <= 0) c = 1;
    setAlignCol(event.target.value === '' ? '' : c);

    if (tiles) {
      if (tiles.length < c) {
        setAlignCol(tiles.length);
        setAlignRow(1);
        setDim([1, tiles.length]);
      }
      let r = Math.ceil(tiles.length / c);
      setAlignRow(r);
      setDim([r, c]);
    }
  };

  // when the border is changed in alignment
  const inputTilingBorder = (event) => {
    setAlignBorder(event.target.value === '' ? '' : Number(event.target.value));
  };

  //When the gap is changed in alignment
  const inputTilingGapX = (event) => {
    if (Number(event.target.value) < 0) return;
    setAlignGapX(event.target.value === '' ? '' : Number(event.target.value));
    setAlignGapY(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingGapY = (event) => {
    if (Number(event.target.value) < 0) return;
    setAlignGapY(event.target.value === '' ? '' : Number(event.target.value));
    setAlignGapX(event.target.value === '' ? '' : Number(event.target.value));
  };

  //When the list item clicked in left tab in the Tiling Part
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setInfoMessage('');
    if (index === 1 || index === 2) {
      setDisplayTilingJpegImages(true);
      setDisplayResultImage(false);
    } else if (index === 0) {
      setDisplayTilingJpegImages(false);
      setDisplayResultImage(false);
    } else if (index === 3 || index === 4 || index === 5) {
      setDisplayTilingJpegImages(false);
      setDisplayResultImage(true);
    }

    if (index === 3 || index === 4) {
    }
    if (index === 5) {
      const resultpath = getResultPath();
      setResultImagePath(resultpath);
      setInfoMessage('Result Image will be displayed');
    }
  };

  const handleAlignViewClicked = () => {};

  //When the alignment Image buttons are clicked
  const handleAlignment = (event) => {
    const v = event.target.name;
    setInfoMessage(`${v} options was clicked.`);
  };

  //when the radio button in alignment was changed
  const handleAlignOptionChange = (e) => {
    if (e.target.value === 'Up-Down') {
      if (dir == Directions.horizontal) {
        setDir(Directions.vertical);
      } else setDir(Directions.horizontal);
    } else if (e.target.value === 'Left-Right') {
      if (align == Alignments.raster) {
        setAlign(Alignments.snake);
      } else setAlign(Alignments.raster);
    } else if (e.target.value === 'DecendingOrder') {
      if (sortOrder == SortOrder.ascending) setSortOrder(SortOrder.descending);
      else setSortOrder(SortOrder.ascending);
    }
  };

  const SnapToEdge = async () => {
    setInfoMessage('Activate Snap To Edge Function');
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await snapToEdge();
    const outputUrl = hostAddr + output + '?' + new Date().getTime();
    setResultImagePath(outputUrl);
    setInfoMessage('You can see the result image in result Tab.');
  };

  const PatternMatching = async () => {
    setInfoMessage('Pattern Matching Function started');
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await snapToEdge();
    const outputUrl = hostAddr + output + '?' + new Date().getTime();
    setResultImagePath(outputUrl);
    setInfoMessage('You can see the result image in result Tab.');
  };
  const autoPatternMatching = () => {};

  //When the radio button in bonding was changed
  const handleChange = (event) => {
    if (event.target.id === '3') {
      if (tilingBondingPatternMatch == false) {
        setTilingBondingPatterMatch(true);
        event.target.checked = true;
      } else {
        setTilingBondingPatterMatch(false);
        event.target.checked = false;
        setSelectBondRadioIdx('1');
        return;
      }
    } else setTilingBondingPatterMatch(false);
    setSelectBondRadioIdx(event.target.id);

    if (event.target.id === '2') {
      SnapToEdge();
    }
  };

  const normalizeImgLuminance = async () => {
    setInfoMessage('Normalize started.');
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await normalizeTiledImage();
    const outputUrl = hostAddr + output;
    //console.log(outputUrl);
    setResultImagePath(outputUrl);

    setInfoMessage(
      'Normalize Image finished.\n It will be displayed in a few seconds.',
    );
  };
  const correctLighting = async () => {
    setInfoMessage('Correction started.');
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await correctionTiledImage();
    const outputUrl = hostAddr + output;
    setResultImagePath(outputUrl);

    setInfoMessage(
      'Correction Image finished.\n It will be displayed in a few seconds.',
    );
  };
  const decreaseImgLuminance = () => {
    setGamma(gamma - 0.1);
    handleChangeLuminance(gamma - 0.1);
    setInfoMessage('Darken Image decreasing Gamma.');
  };
  const increaseImgLuminance = () => {
    setGamma(gamma + 0.1);
    handleChangeLuminance(gamma + 0.1);
    setInfoMessage('Brighten Image increasing Gamma.');
  };

  const handleChangeLuminance = async (gamma) => {
    const param = {
      gamma: gamma,
    };
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await gammaTiledImage(param);
    const outputUrl = hostAddr + output;
    setResultImagePath(outputUrl);
  };

  const resetImgLuminance = () => {
    setGamma(1);
    handleChangeLuminance(1);
  };
  const bestFit = async () => {
    // const hostAddr = tiles[0].url.split('/static')[0];
    // const output = await gammaTiledImage();
    // const outputUrl = hostAddr + output + "?" + new Date().getTime();
    // setResultImagePath(outputUrl);
    handleChangeLuminance(1.4);
    setInfoMessage('Brighten Image increasing Gamma.');
  };

  const exportTiledImage = () => {};

  // When the list item of Edting is changed
  const handleListContentItemClick = async (event, index) => {
    if (tiles.length > 0) {
      setSelectedImageFileIndex(index);

      setResultImagePath(getOmeTiffUrl(tiles[index].url));
      let tile = tiles[index];

      if (tile.z || tile.row || tile.col || tile.series) {
        let newContent = [];

        let tempContent = {};
        const tempVal = tile.z;
        tempContent.z = tile.time;
        tempContent.time = tempVal;
        tempContent.dimensionChanged = tile.dimensionChanged;
        tempContent.row = tile.row;
        tempContent.col = tile.col;
        tempContent.series = tile.strSeries;
        newContent.push(tempContent);

        store.dispatch({ type: 'content_addContent', content: newContent });
      }
    }
  };

  // const handleScaleChange = (event) => {
  //   setScale(event.target.value);
  // };

  // const refreshImageView = async () => {
  //   let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);
  //   if (fileImg !== null) {
  //     displayImage(fileImg);
  //   }
  // };

  // const displayImage = async (file) => {
  //   try {
  //     let type = file.type.toString();
  //     if (type === 'tiff' || type === 'image/tiff') {
  //       setDisplayOneJpegImage(false);
  //       displayTiff(file);
  //     } else setDisplayOneJpegImage(true);
  //   } catch (err) {}
  // };

  // const displayOriginalImage = async (file) => {
  //   //console.log("Display Jpeg");
  //   let imageWidth = 640;
  //   let imageHeight = 480;
  //   const cnv = document.getElementById('canvas');
  //   const ctx = cnv.getContext('2d');
  //   const img = new Image();
  //   img.src = file.name;
  //   img.onload = () => {
  //     ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
  //   };
  // };

  // const displayResponse = async (response) => {
  //   try {
  //     // console.log("DisplayAlignment");
  //     //displayAlignment(response);
  //   } catch (err) {
  //     // console.log(" error : Tiling.js useEffect : ", err);
  //   }
  // };

  // function displayAlignment(response) {}

  // function displayTiff(fileDisplay) {
  //   fileDisplay.arrayBuffer().then((fileBuffer) => {
  //     let ifds = UTIF.decode(fileBuffer);
  //     UTIF.decodeImage(fileBuffer, ifds[0]);

  //     //console.log(ifds[0]);

  //     var rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels
  //     //console.log("RGBA");
  //     //console.log(rgba);

  //     const firstPageOfTif = ifds[0];

  //     let imageWidth = firstPageOfTif.width;
  //     let imageHeight = firstPageOfTif.height;

  //     setWidthImage(imageWidth);
  //     setHeightImage(imageHeight);

  //     const cnv = document.getElementById('canvas');
  //     cnv.width = imageWidth;
  //     cnv.height = imageHeight;

  //     const ctx = cnv.getContext('2d');

  //     //ctx.clearRect(0, 0,imageWidth, imageHeight);
  //     //ctx.save();
  //     //ctx.scale(scale/100, scale/100);
  //     let imageData = ctx.createImageData(
  //       Math.round((imageWidth * scale) / 100.0),
  //       (imageHeight * scale) / 100.0,
  //     );
  //     // let imageData = ctx.drawImage(image, 0, 0, 380, 380);

  //     //   for (let i = 0; i < rgba.length; i++) {
  //     //    imageData.data[i] = rgba[i];
  //     //   }
  //     const data = resizeImage(rgba, imageWidth, imageHeight, scale / 100.0);
  //     for (let i = 0; i < data.length; i++) {
  //       imageData.data[i] = data[i];
  //     }
  //     ctx.putImageData(imageData, 0, 0);
  //     //ctx.restore();
  //   });
  // }

  const AddContentToProps = () => {
    const { content, selectedVesselHole } = props;

    //console.log(tiles);

    let newContent = [];

    let tempContent = {};
    const tempVal = tempContent.z;
    tempContent.z = tempContent.time;
    tempContent.time = tempVal;
    tempContent.dimensionChanged = !tempContent.dimensionChanged;
    tempContent.row = alignRow;
    tempContent.col = alignCol;
    tempContent.series = tiles[0].strSeries;
    newContent.push(tempContent);

    store.dispatch({ type: 'content_addContent', content: newContent });
  };

  const onClickedBuildButton = async () => {
    const ashlarParams = {
      width: dim[1],
      height: dim[0],
      layout: align,
      direction: dir,
    };

    setInfoMessage('Build Started');
    const hostAddr = tiles[0].url.split('/static')[0];
    const output = await buildPyramid(ashlarParams);
    const outputUrl = getResultPath();

    setResultImagePath(outputUrl);
    setInfoMessage(
      'Build Finished. You can see the result Image in result page.',
    );
    AddContentToProps();
  };

  const displayResult = async () => {
    const canvas = document.getElementById('canvas');

    //Load an OME_TIFF file
    const filename = tiles[0].url.split('/').pop();
    const resultpath = tiles[0].url.replace(filename, '') + 'result.ome.tiff';

    const options = { defaultTimePoint: 0 };
    setInfoMessage('Loading result file, please wait.');
    const source = await loadOmeTiff(resultpath, options);
    setInfoMessage('Loading Finished.');
    const loader = createLoader(resultpath);

    const layer = loader.addOmeTiff(source);

    loader.render();
  };

  // //When the output file received
  // const handleAshlarBuild = (output) => {
  //   //  console.log(output);
  //   let fileImg = getImageByUrl(output);

  //   if (fileImg !== null) {
  //     //store.dispatch({type: "tiling_selectedFile", content: file});
  //     displayImage(fileImg);
  //   }
  // };

  return (
    <>
      <Row
        no-gutters="true"
        className="m-0 drop pa-5"
        style={{ maxWidth: '100%', height: '520px' }}
      >
        <Col xs={1} className="border p-0">
          <List className="border p-0" id="position-dlg-span">
            {tilingMenus.map((menuTitle, idx) => {
              return (
                <ListItemButton
                  style={{ fontSize: '12px !important' }}
                  className="border"
                  key={idx}
                  onClick={(event) => handleListItemClick(event, idx)}
                >
                  <ListItemText primary={menuTitle} />
                </ListItemButton>
              );
            })}
          </List>
        </Col>
        <Col xs={3} className="p-0 h-100">
          {/* Tiling Control Panel  */}
          <div className="control-panel h-100">
            {/* Editing */}
            {selectedIndex === 0 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Editing</h5>
                </CardContent>
                <div className="inside overflow-auto">
                  {tiles !== undefined && tiles !== null ? (
                    <List>
                      {tiles.map((item, idx) => {
                        if (idx === selectedImageFileIndex) {
                          return (
                            <ListItemButton
                              style={{
                                width: 'fit-content',
                                backgroundColor: 'lightblue',
                              }}
                              className="border"
                              key={idx}
                              onClick={(event) =>
                                handleListContentItemClick(event, idx)
                              }
                            >
                              <p className="label-text margin-0">
                                {item.filename}
                              </p>
                            </ListItemButton>
                          );
                        } else {
                          return (
                            <ListItemButton
                              style={{
                                width: 'fit-content',
                                backgroundColor: 'white',
                              }}
                              className="border"
                              key={idx}
                              onClick={(event) =>
                                handleListContentItemClick(event, idx)
                              }
                            >
                              <p className="label-text margin-0">
                                {item.filename}
                              </p>
                            </ListItemButton>
                          );
                        }
                      })}
                    </List>
                  ) : (
                    <></>
                  )}
                </div>
              </Card>
            )}
            {/* Alignment */}
            {selectedIndex === 1 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Alignment</h5>
                </CardContent>
                <div className="inside p-3">
                  <ToggleButtonGroup
                    type="radio"
                    name="tiling-align"
                    value={alignment}
                    exclusive
                    // onChange={(e) => {handleAlignment(e)}}
                    aria-label="text alignment"
                  >
                    {[...Array(6)].map((_, i) => {
                      let url_link = require(`../../../../../../assets/images/pos_align_${i}.png`);
                      return (
                        <Tooltip title={tilingAlignButtons[i]} key={i}>
                          <ToggleButton
                            key={`ToggleButton_${i}`}
                            name={tilingAlignButtons[i]}
                            onChange={(e) => handleAlignment(e)}
                          >
                            <img
                              name={tilingAlignButtons[i]}
                              style={{
                                ...stylingTiling.ToggleButtonGroup,
                                filter: i === 3 ? 'grayscale(1)' : '',
                              }}
                              src={url_link}
                              alt="no image"
                            />
                          </ToggleButton>
                        </Tooltip>
                      );
                    })}
                  </ToggleButtonGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleAlignOptionChange}
                          value="Left-Right"
                        />
                      }
                      label="Left-Right"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleAlignOptionChange}
                          value="Up-Down"
                        />
                      }
                      label="Up-Down"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleAlignOptionChange}
                          value="DecendingOrder"
                        />
                      }
                      label="Descending Order"
                    />
                  </FormGroup>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <TextField
                        value={alignRow}
                        size="small"
                        onChange={inputTilingRows}
                        className="range-field"
                        label="Row"
                        inputProps={{
                          type: 'number',
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <TextField
                        value={alignCol}
                        size="small"
                        onChange={inputTilingCols}
                        className="range-field"
                        label="Column"
                        inputProps={{
                          type: 'number',
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={4}>
                      <TextField
                        value={alignBorder}
                        size="small"
                        onChange={inputTilingBorder}
                        className="range-field"
                        label="Border"
                        inputProps={{
                          type: 'number',
                        }}
                      />
                    </Col>
                    <Col xs={4}>
                      <TextField
                        value={alignGapX}
                        size="small"
                        onChange={inputTilingGapX}
                        className="range-field"
                        label="Gap X"
                        inputProps={{
                          type: 'number',
                        }}
                      />
                    </Col>
                    <Col xs={4}>
                      <TextField
                        value={alignGapY}
                        size="small"
                        onChange={inputTilingGapY}
                        className="range-field"
                        label="Gap Y"
                        inputProps={{
                          type: 'number',
                        }}
                      />
                    </Col>
                  </Row>
                  <Button onClick={onClickedBuildButton}> Merge Image</Button>
                </div>
              </Card>
            )}
            {/* Bonding */}
            {selectedIndex === 2 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Bonding</h5>
                </CardContent>
                <div className="inside p-3">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange}
                          id="1"
                          title="1"
                          checked={selectBondRadioIdx === '1'}
                        />
                      }
                      label="None"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange}
                          id="2"
                          title="2"
                          checked={selectBondRadioIdx === '2'}
                        />
                      }
                      label="Snap To Edge"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange}
                          id="3"
                          title="3"
                          checked={selectBondRadioIdx === '3'}
                        />
                      }
                      label="Pattern Match"
                    />
                  </FormGroup>
                  <DialogPM />
                  {tilingBondingPatternMatch && (
                    <>
                      <Row className="mr-4">
                        <Col xs={8} style={{ paddingTop: '20px' }}>
                          <TextField
                            className="range-field"
                            label="Border"
                            defaultValue={25}
                            inputProps={{
                              type: 'number',
                            }}
                          />
                        </Col>
                        <Col xs={8} style={{ paddingTop: '20px' }}>
                          <TextField
                            className="range-field"
                            label="Overlap X"
                            defaultValue={0}
                            inputProps={{
                              type: 'number',
                            }}
                          />
                        </Col>
                        <Col xs={8} style={{ paddingTop: '20px' }}>
                          <TextField
                            className="range-field"
                            label="Overlap Y"
                            defaultValue={0}
                            inputProps={{
                              type: 'number',
                            }}
                          />
                        </Col>
                        <Button
                          elevation="2"
                          className="mt-5"
                          onClick={PatternMatching}
                        >
                          Match
                        </Button>
                      </Row>
                      <Row>
                        <Button
                          elevation="2"
                          className="mt-5"
                          onClick={autoPatternMatching}
                        >
                          Auto Matching
                        </Button>
                      </Row>
                    </>
                  )}
                </div>
              </Card>
            )}
            {/* Shading */}
            {selectedIndex === 3 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Shading</h5>
                </CardContent>
                <div className="inside p-3">
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={normalizeImgLuminance}
                      >
                        Normalize
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={correctLighting}
                      >
                        Correct
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}
            {/* Display */}
            {selectedIndex === 4 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Display</h5>
                </CardContent>
                <div className="inside p-3">
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={decreaseImgLuminance}
                      >
                        -
                      </Button>
                      <Icon color="yellow" path={mdiWeatherSunny} size={1} />
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={increaseImgLuminance}
                      >
                        +
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={resetImgLuminance}
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button
                        className="px-0"
                        style={{
                          minWidth: '34px',
                          height: '34px',
                          color: '#009688',
                        }}
                        onClick={bestFit}
                      >
                        BestFit
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}
            {/* Result */}
            {selectedIndex === 5 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Result</h5>
                </CardContent>
                <div className="inside p-3">
                  {/* <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <ToggleButtonGroup color="primary">
                        <ToggleButton value="true">
                          <Icon path={mdiCropFree} size={1} />
                        </ToggleButton>
                        <ToggleButton value="false">
                          <Icon path={mdiClose} size={1} />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Col>
                  </Row>
                  <Row className="mt-4 mr-4">
                    <Col xs={6}>
                      <Button depressed="true" onClick={exportTiledImage}>
                        Tiled Image
                      </Button>
                    </Col>
                  </Row> */}
                </div>
              </Card>
            )}
            {/* Option */}
            {selectedIndex === 6 && (
              <Card className="h-100" variant="outlined">
                <CardContent className="pa-1">
                  <h5>Option</h5>
                </CardContent>
              </Card>
            )}
          </div>
        </Col>
        <Col
          xs={5}
          className="p-0 h-100"
          sx={{ height: '100%', width: '100%' }}
        >
          {/*  Tiling Preview  */}
          <div style={{ flexDirection: 'column' }}>
            {displayTilingJpegImages === false ? (
              <Avivator type={'tiling'} source={resultImagePath} />
            ) : (
              <Paper
                variant="outlined"
                sx={{ height: '800px', width: '600px' }}
              >
                <TransformWrapper minScale={0.2}>
                  <TransformComponent
                    wrapperStyle={{ height: '800px', width: '600px' }}
                  >
                    <ImageList
                      cols={alignCol}
                      gap={alignGapX}
                      padding={alignBorder}
                      sx={{
                        mb: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      {tilesAligned.map(({ _id, thumbnail, filename }) => (
                        <ImageListItem key={_id}>
                          <img
                            src={thumbnail}
                            alt={filename}
                            style={{ width: 100, height: 'auto' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </TransformComponent>
                </TransformWrapper>
              </Paper>
            )}

            <div className="row m-0">
              <div className="col p-0">
                <ScrollArea />
              </div>
              {/* <div className="col-sm-2 p-0" style={{ position: 'relative' }}>
                <Button
                  className="position-absolute"
                  style={{ height: '40px' }}
                >
                  {scale.toString() + '%'}
                  <Icon size={1} path={mdiPencil} />
                </Button>
                <Select
                  value={scale}
                  onChange={(e) => handleScaleChange(e)}
                  style={{ opacity: '0' }}
                  className="position-absolute"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </div> */}
            </div>
          </div>
        </Col>
        <Col
          xs={3}
          className="p-0 border"
          style={{ height: '100%', position: 'relative', overflowY: 'scroll' }}
        >
          <Vessel />
          <Objective />
          <Channel />
          <ImageAdjust />
          <ZPosition />
          <Timeline />
        </Col>
      </Row>
      <Row>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Typography sx={{ flexGrow: 1 }}>{infoMessage}</Typography>
        </DialogActions>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  content: state.files.content,
  selectedVesselHole: state.vessel.selectedVesselHole,
});

export default connect(mapStateToProps)(TabTiling);
