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
import { TileSeriesDescription } from 'igniteui-react-core';
//import {TIFFViewer} from 'react-tiff';

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
  //const [fileNames, setFileNames] = useState(useTilingStore());
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
  const [alignRow, setAlignRow] = useState(0);
  const [alignCol, setAlignCol] = useState(0);
  const [alignBorder, setAlignBorder] = useState(0);
  const [alignGapX, setAlignGapX] = useState(0);
  const [alignGapY, setAlignGapY] = useState(0);

  const canvasElement = useRef(null);

  // Change text fields
  const inputTilingRows = (event) => {
    setAlignRow(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingCols = (event) => {
    setAlignCol(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingBorder = (event) => {
    setAlignBorder(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingGapX = (event) => {
    setAlignGapX(event.target.value === '' ? '' : Number(event.target.value));
  };
  const inputTilingGapY = (event) => {
    setAlignGapY(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleAlignment = (event) => {
    //console.log(" handleAlignment", tiles.length, event.target.value);
    if (tiles.length > 0) {
      let method = event.target.value;
      if (tilingAlignButtons.includes(method)) {
        //console.log("Go to Api");
        api_tiles.alignTilesApi(tiles.length, method, handleApi);
      }
    }
  };

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
  };

  //When the radio button in bonding was changed
  const handleChange = (event) => {
    if (event.target.id == '3') {
      if (event.target.checked == true) setTilingBondingPatterMatch(true);
      else setTilingBondingPatterMatch(false);
    } else setTilingBondingPatterMatch(false);

    // setChecked(event.target.checked);
    // if (fileObjs.length > 0) {
    //     api_tiles.listTiles(handleApi);
    // }
  };

  const autoPatternMathing = () => {
    //console.log("clicked!!!!!");
  };

  const normalizeImgLuminance = () => {
    //console.log("clicked!!!!!");
  };
  const correctLighting = () => {
    //console.log("clicked!!!!!");
  };
  const decreaseImgLuminance = () => {
    //console.log("clicked!!!!!");
  };
  const increaseImgLuminance = () => {
    //console.log("clicked!!!!!");
  };
  const resetImgLuminance = () => {
    //console.log("clicked!!!!!");
  };
  const bestFit = () => {
    // console.log("clicked!!!!!");
  };
  const exportTiledImage = () => {
    // console.log("clicked!!!!!");
  };

  const handleScaleChange = (event) => {
    //console.log("handleScaleChange", event.target.value);
    setScale(event.target.value);
  };

  useEffect(() => {
    //console.log(scale);
    if (selectedIndex == 0) refreshImageView();
  }, [scale]);

  const refreshImageView = async () => {
    //console.log(scale);
    let fileImg = await getImageByUrl(tiles[selectedImageFileIndex].url);

    if (fileImg !== null) {
      //store.dispatch({type: "tiling_selectedFile", content: file});
      displayImage(fileImg);
    }
  };
  const handleListContentItemClick = async (event, index) => {
    if (tiles.length > 0) {
      setSelectedImageFileIndex(index);
      setDisplayImg(tiles[index].url);
      // console.log(tiles[index].url);

      let fileImg = await getImageByUrl(tiles[index].url);

      if (fileImg !== null) {
        //store.dispatch({type: "tiling_selectedFile", content: file});
        displayImage(fileImg);
      }
    }
    // if (tiles.length > 0) {
    //   setSelectedImageFileIndex(index);
    //   displayImage(tiles[index]);
    // }

    // console.log(" Selected Image : ", index);
    // if (TileSeriesDescription.length > 0) {

    //     let fileUrl = tiles[index].filename;
    //     if (fileUrl !== null) {
    //          store.dispatch({type: "tiling_selectedFile", content: file});
    //          displayImage(file);
    //     }
    // }
  };

  const displayImage = async (file) => {
    let type = file.type.toString();
    try {
      if (type === 'tiff') {
        displayTiff(file);
      }
      if (type === 'image/tiff') {
        displayTiff(file);
      }
      displayOriginalImage(file);
    } catch (err) {
      //console.log(" error : Tiling.js useEffect : ", err);
    }
  };

  const displayOriginalImage = async (file) => {
    //console.log("imgae/jpeg");
    //console.log(file);
    const cnv = document.getElementById('canvas');
    const ctx = cnv.getContext('2d');
    const img = new Image();
    img.src = file.name;
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
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

      for (let i = 0; i < rgba.length; i++) {
        imageData.data[i] = rgba[i];
      }

      ctx.putImageData(imageData, 0, 0);
      //ctx.restore();
    });
  }

  useEffect(() => {
    refreshImageView();
  }, []);

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
                    value={alignment}
                    exclusive
                    onChange={(e) => {
                      handleAlignment(e);
                    }}
                    aria-label="text alignment"
                  >
                    {[...Array(6)].map((_, i) => {
                      let url = require(`../../../../../../assets/images/pos_align_${i}.png`);
                      return (
                        <Tooltip title={tilingAlignButtons[i]} key={i}>
                          <ToggleButton
                            key={`ToggleButton_${i}`}
                            value={tilingAlignButtons[i]}
                          >
                            <img
                              value={tilingAlignButtons[i]}
                              style={{
                                ...stylingTiling.ToggleButtonGroup,
                                filter: i === 3 ? 'grayscale(1)' : '',
                              }}
                              src={url}
                              alt="no image"
                            />
                          </ToggleButton>
                        </Tooltip>
                      );
                    })}
                  </ToggleButtonGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox onChange={handleAlignOptionChange} />}
                      label="Left-Right"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleAlignOptionChange} />}
                      label="Up-Down"
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleAlignOptionChange} />}
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
        <Col xs={5} className="p-0 h-100">
          {/*  Tiling Preview  */}
          <div style={{ flexDirection: 'column' }}>
            <div
              className="row m-0"
              style={{
                backgroundColor: '#ddd',
                height: '380px',
                width: '380px',
                overflowY: 'auto',
              }}
            >
              <RoutedAvivator type={'tiling'} />
              {/* <img id="displayCanvas" className="canvas m-auto w-100" style={{ cursor: "grab" }} src={displayImg} /> */}
              <canvas
                id="canvas"
                className="canvas m-auto"
                ref={canvasElement}
                style={{ cursor: 'grab' }}
              />

              {/* { displayImg ? <DisplayTiff tiffUrl={displayImg} /> : <></> } */}
            </div>
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
