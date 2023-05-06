import React, { useRef, useState, useEffect } from 'react';
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
import AlignmentPart from './TabTiling';
import { TileSeriesDescription } from 'igniteui-react-core';
import { ImageList, ImageListItem, Paper } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const tilingMenus = [
  'Edit',
  'Alignment',
  'Bonding',
  'Shading',
  'Display',
  'Result',
  'Option',
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
  const { fileNames } = useTilingStore();
  const { tiles } = useTilingStore();

  const [fileObjs, setFileObjs] = useState([]);
  const [selectedImageFileIndex, setSelectedImageFileIndex] = useState(0);

  const [widthImage, setWidthImage] = useState(window.innerWidth);
  const [heightImage, setHeightImage] = useState(window.innerHeight);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [alignment, setAlignment] = useState();
  const [checked, setChecked] = useState(true);
  const [scale, setScale] = useState(100);
  const [loadImageSource, setLoadImageSource] = useState(null);
  const [displayImg, setDisplayImg] = useState('');

  const [tiling_bonding_patternMatch, setTilingBondingPatterMatch] =
    useState(false);

  //Parameters in Alignment UI
  const [alignRow, setAlignRow] = useState(1);
  const [alignCol, setAlignCol] = useState(1);
  const [alignBorder, setAlignBorder] = useState(0);
  const [alignGapX, setAlignGapX] = useState(0);
  const [alignGapY, setAlignGapY] = useState(0);

  const [alignOption, setAlignOption] = useState();

  //Parameters in Shading UI
  const [brightness, setBrightness] = useState(1);
  const [luminance, setLuminance] = useState(0);

  const canvasElement = useRef(null);

  const [displayOneJpegImage, setDisplayOneJpegImage] = useState(false);
  const [displayTilingJpegImages, setDisplayTilingJpegImages] = useState(false);

  // Change text fields
  const inputTilingRows = (event) => {
    setAlignRow(event.target.value === '' ? '' : Number(event.target.value));
    let r = Number(event.target.value);
    if (tiles) {
      setAlignCol(Math.ceil(tiles.length / r));
    }
  };
  const inputTilingCols = (event) => {
    setAlignCol(event.target.value === '' ? '' : Number(event.target.value));
    let c = Number(event.target.value);
    if (tiles) {
      setAlignRow(Math.ceil(tiles.length / c));
    }
  };
  const inputTilingBorder = (event) => {
    setAlignBorder(event.target.value === '' ? '' : Number(event.target.value));
  };
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

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if (index == 1) {
      setDisplayTilingJpegImages(true);
    } else setDisplayTilingJpegImages(false);
  };

  const handleAlignViewClicked = () => {};

  const handleAlignment = (event) => {};

  const handleApi = (response, status) => {
    //console.log("Handle API ");
    if (status) {
      //console.log("handleAlignTilesApi : response :", response);
      displayResponse(response);
    } else {
      //console.log("handleAlignTilesApi : error :", response);
    }
  };

  //when the radio button in alignment was changed
  const handleAlignOptionChange = (e) => {
    //console.log("Handle alignment options");
    //console.log(e.target.value);
    setAlignOption(e.target.value);
  };

  //When the radio button in bonding was changed
  const handleChange = (event) => {
    if (event.target.id == '3') {
      if (event.target.checked == true) setTilingBondingPatterMatch(true);
      else setTilingBondingPatterMatch(false);
    } else setTilingBondingPatterMatch(false);
  };

  const autoPatternMathing = () => {};

  const normalizeImgLuminance = async () => {
    let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);

    if (fileImg !== null) {
      fileImg.arrayBuffer().then((fileBuffer) => {
        let ifds = UTIF.decode(fileBuffer);
        UTIF.decodeImage(fileBuffer, ifds[0]);

        var rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels

        const firstPageOfTif = ifds[0];

        let imageWidth = firstPageOfTif.width;
        let imageHeight = firstPageOfTif.height;

        setWidthImage(imageWidth);
        setHeightImage(imageHeight);

        const cnv = document.getElementById('canvas');
        cnv.width = imageWidth;
        cnv.height = imageHeight;

        const ctx = cnv.getContext('2d');

        let imageData = ctx.createImageData(
          Math.round((imageWidth * scale) / 100.0),
          (imageHeight * scale) / 100.0,
        );

        for (let i = 0; i < rgba.length; i++) {
          const red = rgba[i];
          const green = rgba[i + 1];
          const blue = rgba[i + 2];

          const luminance =
            (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
          const normalizedRed = Math.round(luminance * 255);
          const normalizedGreen = Math.round(luminance * 255);
          const normalizedBlue = Math.round(luminance * 255);

          rgba[i] = normalizedRed;
          rgba[i + 1] = normalizedGreen;
          rgba[i + 2] = normalizedBlue;
        }

        const data = resizeImage(rgba, imageWidth, imageHeight, scale / 100.0);
        for (let i = 0; i < data.length; i++) {
          imageData.data[i] = data[i];
        }
        ctx.putImageData(imageData, 0, 0);
      });
    }
  };
  const correctLighting = () => {
    setLuminance(2);
  };
  const decreaseImgLuminance = () => {
    setLuminance(luminance - 2);
  };
  const increaseImgLuminance = () => {
    setLuminance(luminance + 2);
  };

  const handleChangeLuminance = async () => {
    let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);

    if (fileImg !== null) {
      fileImg.arrayBuffer().then((fileBuffer) => {
        let ifds = UTIF.decode(fileBuffer);
        UTIF.decodeImage(fileBuffer, ifds[0]);

        var rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels

        const firstPageOfTif = ifds[0];

        let imageWidth = firstPageOfTif.width;
        let imageHeight = firstPageOfTif.height;

        setWidthImage(imageWidth);
        setHeightImage(imageHeight);

        const cnv = document.getElementById('canvas');
        cnv.width = imageWidth;
        cnv.height = imageHeight;

        const ctx = cnv.getContext('2d');

        let imageData = ctx.createImageData(
          Math.round((imageWidth * scale) / 100.0),
          (imageHeight * scale) / 100.0,
        );

        for (let i = 0; i < rgba.length; i++) {
          const red = rgba[i];
          const green = rgba[i + 1];
          const blue = rgba[i + 2];
          rgba[i] = red + luminance;
          rgba[i + 1] = green + luminance;
          rgba[i + 2] = blue + luminance;
        }
        const data = resizeImage(rgba, imageWidth, imageHeight, scale / 100.0);
        for (let i = 0; i < data.length; i++) {
          imageData.data[i] = data[i];
        }
        ctx.putImageData(imageData, 0, 0);
      });
    }
  };

  useEffect(() => {
    handleChangeLuminance();
  }, [luminance, scale]);

  const resetImgLuminance = () => {
    setLuminance(0);
  };
  const bestFit = async () => {
    let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);

    if (fileImg !== null) {
      fileImg.arrayBuffer().then((fileBuffer) => {
        let ifds = UTIF.decode(fileBuffer);
        UTIF.decodeImage(fileBuffer, ifds[0]);

        var data = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels
        let minLuminance = Infinity;
        let maxLuminance = -Infinity;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          if (luminance < minLuminance) {
            minLuminance = luminance;
          }

          if (luminance > maxLuminance) {
            maxLuminance = luminance;
          }
        }

        const range = maxLuminance - minLuminance;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const scaledLuminance = ((luminance - minLuminance) / range) * 255;

          data[i] = scaledLuminance;
          data[i + 1] = scaledLuminance;
          data[i + 2] = scaledLuminance;
        }

        const firstPageOfTif = ifds[0];

        let imageWidth = firstPageOfTif.width;
        let imageHeight = firstPageOfTif.height;

        setWidthImage(imageWidth);
        setHeightImage(imageHeight);

        const cnv = document.getElementById('canvas');
        cnv.width = imageWidth;
        cnv.height = imageHeight;

        const ctx = cnv.getContext('2d');

        let imageData = ctx.createImageData(
          Math.round((imageWidth * scale) / 100.0),
          (imageHeight * scale) / 100.0,
        );

        const image = resizeImage(data, imageWidth, imageHeight, scale / 100.0);
        for (let i = 0; i < image.length; i++) {
          imageData.data[i] = image[i];
        }
        ctx.putImageData(imageData, 0, 0);
      });
    }
  };

  const exportTiledImage = () => {};
  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  const refreshImageView = async () => {
    let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);
    if (fileImg !== null) {
      displayImage(fileImg);
    }
  };
  const handleListContentItemClick = async (event, index) => {
    if (tiles.length > 0) {
      setSelectedImageFileIndex(index);
      setDisplayImg(tiles[index].url);

      let fileImg = await getImageByUrl(tiles[index].url);

      if (fileImg !== null) {
        displayImage(fileImg);
      }
    }
  };

  const displayImage = async (file) => {
    try {
      let type = file.type.toString();
      if (type === 'tiff' || type === 'image/tiff') {
        setDisplayOneJpegImage(false);
        displayTiff(file);
      } else setDisplayOneJpegImage(true);
    } catch (err) {}
  };

  const displayOriginalImage = async (file) => {
    //console.log("Display Jpeg");
    let imageWidth = 640;
    let imageHeight = 480;
    const cnv = document.getElementById('canvas');
    const ctx = cnv.getContext('2d');
    const img = new Image();
    img.src = file.name;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
    };
  };

  const displayResponse = async (response) => {
    try {
      // console.log("DisplayAlignment");
      //displayAlignment(response);
    } catch (err) {
      // console.log(" error : Tiling.js useEffect : ", err);
    }
  };

  function displayAlignment(response) {
    var rgba = UTIF.toRGBA8(response[0]); // Uint8Array with RGBA pixels
    const firstPageOfTif = response[0];
    const imageWidth = firstPageOfTif.width;
    const imageHeight = firstPageOfTif.height;
    setWidthImage(imageWidth);
    setHeightImage(imageHeight);
    const cnv = document.getElementById('canvas');
    cnv.width = imageWidth;
    cnv.height = imageHeight;
    const ctx = cnv.getContext('2d');
    const imageData = ctx.createImageData(imageWidth, imageHeight);
    for (let i = 0; i < rgba.length; i++) {
      imageData.data[i] = rgba[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const resizeImage = (arr, width, height, scale) => {
    var res = [];
    const w = width * scale;
    const h = height * scale;
    const dim = 4;

    for (let d = 0; d < dim; d++) {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          let x = (i * width) / w;
          let y = (j * height) / h;
          let value = 0;
          let vcnt = 0;
          for (let k = x - 1; k <= x + 1; k++) {
            for (let p = y - 1; p <= y + 1; p++) {
              if (k < 0 || k >= width || p < 0 || p >= height) continue;
              value += arr[(p * width + k) * dim + d];
              vcnt++;
            }
          }
          value /= vcnt;
          res[(j * w + i) * dim + d] = value;
        }
      }
    }
    return res;
  };

  function displayTiff(fileDisplay) {
    fileDisplay.arrayBuffer().then((fileBuffer) => {
      let ifds = UTIF.decode(fileBuffer);
      UTIF.decodeImage(fileBuffer, ifds[0]);

      //console.log(ifds[0]);

      var rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array with RGBA pixels
      //console.log("RGBA");
      //console.log(rgba);

      const firstPageOfTif = ifds[0];

      let imageWidth = firstPageOfTif.width;
      let imageHeight = firstPageOfTif.height;

      setWidthImage(imageWidth);
      setHeightImage(imageHeight);

      const cnv = document.getElementById('canvas');
      cnv.width = imageWidth;
      cnv.height = imageHeight;

      const ctx = cnv.getContext('2d');

      //ctx.clearRect(0, 0,imageWidth, imageHeight);
      //ctx.save();
      //ctx.scale(scale/100, scale/100);
      let imageData = ctx.createImageData(
        Math.round((imageWidth * scale) / 100.0),
        (imageHeight * scale) / 100.0,
      );
      // let imageData = ctx.drawImage(image, 0, 0, 380, 380);

      //   for (let i = 0; i < rgba.length; i++) {
      //    imageData.data[i] = rgba[i];
      //   }
      const data = resizeImage(rgba, imageWidth, imageHeight, scale / 100.0);
      for (let i = 0; i < data.length; i++) {
        imageData.data[i] = data[i];
      }
      ctx.putImageData(imageData, 0, 0);
      //ctx.restore();
    });
  }

  useEffect(() => {
    refreshImageView();
  }, []);

  //When the output file received
  const handleAshlarBuild = (output) => {
    //  console.log(output);
    let fileImg = getImageByUrl(output);

    if (fileImg !== null) {
      //store.dispatch({type: "tiling_selectedFile", content: file});
      displayImage(fileImg);
    }
  };

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
                          checked={alignOption === 'Left-Right'}
                        />
                      }
                      label="Left-Right"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleAlignOptionChange}
                          value="Up-Down"
                          checked={alignOption === 'Up-Down'}
                        />
                      }
                      label="Up-Down"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleAlignOptionChange}
                          value="DecendingOrder"
                          checked={alignOption === 'DecendingOrder'}
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
                        <Checkbox onChange={handleChange} id="1" title="1" />
                      }
                      label="None"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox onChange={handleChange} id="2" title="2" />
                      }
                      label="Snap To Edge"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox onChange={handleChange} id="3" title="3" />
                      }
                      label="Pattern Match"
                    />
                  </FormGroup>
                  <DialogPM />
                  {tiling_bonding_patternMatch && (
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
                        onClick={autoPatternMathing}
                      >
                        Auto
                      </Button>
                    </Row>
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
                  <Row className="mt-4 mr-4">
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
                  </Row>
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
            {displayTilingJpegImages == false ? (
              displayOneJpegImage == false ? (
                <div
                  className="row m-0"
                  style={{
                    backgroundColor: '#ddd',
                    height: '380px',
                    width: '380px',
                    overflowY: 'auto',
                  }}
                >
                  <canvas
                    id="canvas"
                    className="canvas m-auto"
                    ref={canvasElement}
                    style={{ cursor: 'grab' }}
                  />
                </div>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{ height: '800px', width: '600px' }}
                >
                  <TransformWrapper minScale={0.2}>
                    <TransformComponent
                      wrapperStyle={{ height: '800px', width: '600px' }}
                    >
                      <img
                        src={tiles[selectedImageFileIndex].thumbnail}
                        alt={tiles[selectedImageFileIndex].filename}
                        style={{ width: 100, height: 'auto' }}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </Paper>
              )
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
                      {tiles.map(({ _id, thumbnail, filename }) => (
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
              <div className="col-sm-2 p-0" style={{ position: 'relative' }}>
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
              </div>
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
    </>
  );
};

const mapStateToProps = (state) => ({
  content: state.files.content,
});

export default connect(mapStateToProps)(TabTiling);
