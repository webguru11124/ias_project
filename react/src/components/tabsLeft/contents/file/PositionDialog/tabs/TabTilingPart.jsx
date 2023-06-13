import React, { useState, useEffect, useMemo } from 'react';
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
import DialogPM from '../../DialogPM';
import Icon from '@mdi/react';
import { mdiWeatherSunny } from '@mdi/js';
import { connect, useSelector } from 'react-redux';
import Vessel from '../../../../../tabsRight/contents/viewcontrol/Vessel';
import Objective from '../../../../../tabsRight/contents/viewcontrol/Objective';
import Channel from '../../../../../tabsRight/contents/viewcontrol/Channel';
import ImageAdjust from '../../../../../tabsRight/contents/viewcontrol/ImageAdjust';
import ZPosition from '../../../../../tabsRight/contents/viewcontrol/ZPosition';
import Timeline from '../../../../../tabsRight/contents/viewcontrol/Timeline';
import store from '../../../../../../reducers';
import useTilingStore from '@/stores/useTilingStore';
import { DialogActions, ImageList, ImageListItem, Paper } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import Avivator from '../../../../../avivator/Avivator';
import { Alignments, Directions, SortOrder } from './constants';
import { buildPyramid } from '@/api/tiling';
import { Typography } from 'react-md';
//import { getMetadataFromDataBase } from '@/api/tiles';
//import { cleanUrl } from '@/helpers/file';

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

let stylingTiling = {
  ToggleButtonGroup: { margin: '0 auto', width: '22px', height: '22px' },
};

const TabTiling = (props) => {
  const allTiles = useTilingStore().tiles;

  const [selectedImageFileIndex, setSelectedImageFileIndex] = useState(0);

  // get the series array
  const [tiles, setTiles] = useState([]);
  const [tileSeries, setTileSeries] = useState([]);
  const [currentSeriesIdx, setCurrentSeriesIdx] = useState(0);

  //tab left index
  const [selectedIndex, setSelectedIndex] = useState(0);
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
  const [alignImages, setAlignImages] = useState([]);

  //parameters in bonding
  const [selectBondRadioIdx, setSelectBondRadioIdx] = useState('0');

  //Parameters in Shading UI
  const [gamma, setGamma] = useState(10);

  //Path used in displaying Images
  const [resultImagePath, setResultImagePath] = useState('');
  const [finalResultImagePath, setFinalResultImagePath] = useState('');

  //Logs
  const [infoMessage, setInfoMessage] = useState();

  // get Row, Col, vessel type
  const [vesselType, setVesselType] = useState(1);

  // the editing list corresponding to well hole
  const [holeImageList, setHoleImageList] = useState([]);

  const selectedImage = useSelector((state) => state.selectedImage);

  //the parameter for the editing
  const [displayEditingEnabled, setDisplayEditingEnabled] = useState(false);

  /*
  //Get the *.xml url from the original Image file name
  const getXmlUrl = (url, filename) => {
    const realUrl = url.split(filename)[0];
    const name = filename.split('.')[0];

    const newExtension = '.xml';
    const newUrl = realUrl + name + newExtension;
    return newUrl;
  };
  */

  //Get the image of ome tiff file extension from the original url
  const getOmeTiffUrl = (url) => {
    let tempUrl = url;
    const ext = url.split('.').pop();
    if (ext !== 'tiff' && ext !== 'tif') {
      const newExtension = 'ome.tiff';
      tempUrl = url.replace(/\.[^/.]+$/, `.${newExtension}`);
    }

    const serverUrl = tempUrl.split('static')[0];
    const path = tempUrl.split('static')[1];

    const newUrl = serverUrl + `image/download/?path=${path}`;

    return newUrl;
  };

  //Get the MaxRow, MaxCol, and VesselType
  const getVesselType = () => {
    let maxRow = 0;
    let maxCol = 0;

    if (!tiles) {
      setVesselType(1);
      return;
    }

    tiles.forEach((tile) => {
      let row = tile.row.charCodeAt() - 'A'.charCodeAt();
      if (maxRow < row) maxRow = row;
      if (maxCol < Number(tile.col)) maxCol = Number(tile.col);
    });

    let series = tiles[0].strSeries;

    if (series === '') {
      setVesselType(1);
      return;
    }

    if (series.includes('Slide')) {
      if (maxRow + 1 === 1 && maxCol === 1) {
        setVesselType(1);
      }
      if (maxRow + 1 === 1 && maxCol === 2) {
        setVesselType(2);
      }
      if (maxRow + 1 === 1 && maxCol === 4) {
        setVesselType(4);
      }

      return;
    } else if (series.includes('Plate')) {
      if (maxRow + 1 === 2 && maxCol === 2) {
        setVesselType(7);
      }
      if (maxRow + 1 === 2 && maxCol === 3) {
        setVesselType(8);
      }
      if (maxRow + 1 === 3 && maxCol === 4) {
        setVesselType(9);
      }
      if (maxRow + 1 === 4 && maxCol === 6) {
        setVesselType(10);
      }
      if (maxRow + 1 === 6 && maxCol === 8) {
        setVesselType(11);
      }
      if (maxRow + 1 === 8 && maxCol === 12) {
        setVesselType(12);
      }
      if (maxRow + 1 === 16 && maxCol === 24) {
        setVesselType(13);
      }
      return;
    } else {
      setVesselType(14);
    }

    return;
  };

  const getSeries = (tiles) => {
    if (!tiles || tiles.length === 0) return [];
    if (!tiles[0].strSeries) return [];

    const Arr = [];
    tiles.map((tile) => {
      Arr.push(tile.strSeries);
    });

    const tempSet = new Set(Arr);
    const tempArray = [...tempSet];

    return tempArray;
  };

  //calculate the suitable col and row number
  const calculateSuitableDim = (size) => {
    let col = 1;
    let row = size;

    for (let i = 1; i * i <= size; i++) {
      if (size % i === 0) {
        col = i;
        row = size / i;
      }
    }

    return [col, row];
  };

  //when the all tiles loaded, need to get series array and  set the current series
  useEffect(() => {
    const tempArr = getSeries(allTiles);
    setTileSeries(tempArr);
    setCurrentSeriesIdx(0);
  }, [allTiles]);

  //When the series Idx is changed
  useEffect(() => {
    if (!tileSeries || !allTiles) return;
    const cur_series = tileSeries[currentSeriesIdx];
    const filteredTiles = allTiles.filter(
      (tile) => tile.strSeries === cur_series,
    );

    if (filteredTiles) setTiles(filteredTiles);
    else setTiles([]);
  }, [currentSeriesIdx, tileSeries]);

  // When the tiles reload, set dim by default 1 * tiles.length()
  useEffect(() => {
    if (!tiles || tiles.length === 0) return;

    if (tiles) {
      setInfoMessage(`${tiles.length} images are loaded.`);

      const sortedTiles = tiles.sort((a, b) =>
        a.filename.localeCompare(b.filename),
      );

      let tile = sortedTiles[0];

      if (tile) {
        if (
          tile.row !== undefined &&
          tile.col !== undefined &&
          tile.series !== undefined &&
          tile.series !== '' &&
          tile.col !== ''
        ) {
          let newContent = [];

          getVesselType();

          sortedTiles.map((tile) => {
            let tempContent = {};
            tempContent.z = tile.z;
            tempContent.time = tile.time;
            tempContent.dimensionChanged = tile.dimensionChanged;
            tempContent.row = tile.row.charCodeAt() - 'A'.charCodeAt();
            tempContent.col = tile.col;
            tempContent.series = tile.strSeries;
            tempContent.channel = tile.channel;
            newContent.push(tempContent);
          });

          newContent[0].objective = -1;

          //current series
          newContent[0].selectedSeriesIdx = currentSeriesIdx;
          newContent[0].seriesCount = tileSeries.length;

          const tempChannels = [1, 0, 0, 0, 0, 0, 0];

          //console.log(newContent);

          let images = getImageListFromCertainTiles(sortedTiles, 0, 1);

          //console.log(images);

          images.map((image) => {
            const idx = Number(image.channel.split('d')[1]);
            tempChannels[idx] = 1;
          });
          newContent[0].channels = tempChannels;

          store.dispatch({ type: 'content_addContent', content: newContent });

          setHoleImageList(images);
        } else {
          let newContent = [];

          sortedTiles.map((tile) => {
            let tempContent = {};
            tempContent.dimensionChanged = false;
            tempContent.row = 0;
            tempContent.col = 0;
            tempContent.series = 'Slide';
            tempContent.channel = 0;
            tempContent.vesselID = 1;
            newContent.push(tempContent);
          });

          store.dispatch({ type: 'content_addContent', content: newContent });

          setHoleImageList(sortedTiles);
        }
      }
    }
  }, [tiles]);

  //when the series is changed in vessel dialog
  useEffect(() => {
    const changedSeriesIdx = props.selectedVesselIdx;
    setCurrentSeriesIdx(changedSeriesIdx);
  }, [props.selectedVesselIdx]);

  //get the image lists for alignment
  const getAlignImageList = (lists) => {
    if (lists.length == 0) return [];

    const arr = [];
    const res = [];
    lists.map((item) => {
      const url = item.url.split('/static/')[0];
      if (item.ashlar_path !== '' && item.ashlar_path !== undefined) {
        const path = item.ashlar_path.split('/static/')[1];

        const filename = path.split('.')[0] + '.timg';
        const ext = path.split('.')[1];
        const fullpath = url + '/static/' + filename;

        const series = item.field.split('f')[1];
        const newFileName =
          'tile_image_series' + series.toString().padStart(5, '0') + '.' + ext;

        if (!arr.includes(fullpath)) {
          arr.push(fullpath);
          const new_item = {
            thumbnail: fullpath,
            _id: item._id,
            field: item.field,
            row: item.row,
            col: item.col,
            filename: newFileName,
          };
          res.push(new_item);
        }
      }
    });

    const [col, row] = calculateSuitableDim(res.length);
    setAlignCol(col);
    setAlignRow(row);
    setDisplayEditingEnabled(true);
    return res;
  };

  //When the holeImageLists is reload
  useEffect(() => {
    if (holeImageList) {
      if (holeImageList[0]) {
        setResultImagePath(getOmeTiffUrl(holeImageList[0].url));
        handleListContentItemClick(new Event('click'), 0);

        const alignImageList = getAlignImageList(holeImageList);
        setAlignImages(alignImageList);
      }
    }
  }, [holeImageList]);

  //get the images from tiles, row and col
  const getImageListFromCertainTiles = (tiles, row, col) => {
    const lists = [];
    const tempList = [];
    //console.log(tiles);
    if (tiles) {
      if (tiles.length > 0) {
        if (
          tiles[0].row !== undefined &&
          tiles[0].col !== undefined &&
          tiles[0].row !== '' &&
          tiles[0].col !== ''
        ) {
          tiles.map((tile) => {
            tempList.push({
              row: Number(tile.row.charCodeAt() - 'A'.charCodeAt()),
              col: Number(tile.col),
            });
            if (
              Number(tile.row.charCodeAt() - 'A'.charCodeAt()) === row &&
              Number(tile.col) === col
            ) {
              lists.push(tile);
            }
          });
        } else return tiles;
      }
    }
    return lists;
  };

  //get the Edit Image List from the row and col
  const getImageList = (row, col) => {
    const lists = [];
    const tempList = [];
    //console.log(tiles);
    if (tiles) {
      if (tiles.length > 0) {
        if (
          tiles[0].row !== undefined &&
          tiles[0].col !== undefined &&
          tiles[0].row !== '' &&
          tiles[0].col !== ''
        ) {
          tiles.map((tile) => {
            tempList.push({
              row: Number(tile.row.charCodeAt() - 'A'.charCodeAt()),
              col: Number(tile.col),
            });
            if (
              Number(tile.row.charCodeAt() - 'A'.charCodeAt()) === row &&
              Number(tile.col) === col
            ) {
              lists.push(tile);
            }
          });
        } else return tiles;
      }
    }
    return lists;
  };

  // set the Hole Image List and display
  // params; row, col
  const setHoleImages = (row, col) => {
    const lists = getImageList(row, col);

    const sortedTiles = lists.sort((a, b) =>
      a.filename.localeCompare(b.filename),
    );

    if (!sortedTiles || sortedTiles.length === 0) return;

    setHoleImageList(sortedTiles);

    const tempChannels = [1, 0, 0, 0, 0, 0, 0];
    let time = 'p00';
    let channel = 0;

    if (
      sortedTiles[0].time !== undefined &&
      sortedTiles[0].channel !== undefined &&
      sortedTiles[0].z !== undefined
    ) {
      time = sortedTiles[0].time;

      sortedTiles.map((image) => {
        const idx = Number(image.channel.split('d')[1]);
        tempChannels[idx] = 1;
      });
    }

    const fullList = tiles.sort((a, b) => a.filename.localeCompare(b.filename));

    if (
      fullList[0].strSeries !== undefined &&
      fullList[0].row !== undefined &&
      fullList[0].channel !== undefined &&
      fullList[0].strSeries !== '' &&
      fullList[0].row !== '' &&
      fullList[0].channel !== ''
    ) {
      let newContent = [];
      let tempContent = {};
      tempContent.z = sortedTiles[0].z;
      tempContent.time = time;
      tempContent.dimensionChanged = sortedTiles[0].dimensionChanged;
      tempContent.row = row;
      tempContent.col = col;
      tempContent.series = sortedTiles[0].strSeries;
      tempContent.channel = Number(sortedTiles[0].channel.split('d')[1]);
      newContent.push(tempContent);

      fullList.map((tile) => {
        let tempContent = {};

        tempContent.z = tile.z;
        tempContent.time = tile.time;
        tempContent.dimensionChanged = tile.dimensionChanged;
        tempContent.row = tile.row.charCodeAt() - 'A'.charCodeAt();
        tempContent.col = tile.col;
        tempContent.series = tile.strSeries;
        tempContent.channel = Number(tile.channel.split('d')[1]);
        newContent.push(tempContent);
      });

      newContent[0].channels = tempChannels;
      newContent[0].objective = -1;
      //current series
      newContent[0].selectedSeriesIdx = currentSeriesIdx;
      newContent[0].seriesCount = tileSeries.length;

      store.dispatch({ type: 'content_addContent', content: newContent });
    }
  };

  //When the row and col are changed
  //display the change of the holes in the vessel
  useEffect(() => {
    const hole = props.selectedVesselHole;

    if (!tiles) return;

    if (vesselType === 1 || vesselType === 2 || vesselType == 4) {
      const fullList = tiles.sort((a, b) =>
        a.filename.localeCompare(b.filename),
      );
      if (!fullList || fullList.length === 0) return;

      if (
        fullList[0].strSeries !== undefined &&
        fullList[0].row !== undefined &&
        fullList[0].channel !== undefined &&
        fullList[0].strSeries !== '' &&
        fullList[0].row !== '' &&
        fullList[0].channel !== ''
      ) {
        let newContent = [];

        fullList.map((tile) => {
          let tempContent = {};

          tempContent.z = tile.z;
          tempContent.time = tile.time;
          tempContent.dimensionChanged = tile.dimensionChanged;
          tempContent.row = tile.row.charCodeAt() - 'A'.charCodeAt();
          tempContent.col = tile.col;
          tempContent.series = tile.strSeries;
          tempContent.channel = Number(tile.channel.split('d')[1]);
          newContent.push(tempContent);
        });

        const tempChannels = [1, 0, 0, 0, 0, 0, 0];

        //current series
        newContent[0].selectedSeriesIdx = currentSeriesIdx;
        newContent[0].seriesCount = tileSeries.length;

        fullList.map((image) => {
          const idx = Number(image.channel.split('d')[1]);
          tempChannels[idx] = 1;
        });

        newContent[0].objective = -1;
        newContent[0].channels = tempChannels;

        store.dispatch({ type: 'content_addContent', content: newContent });

        return;
      }
    }

    if (hole) {
      if (hole.row !== undefined && hole.col !== undefined) {
        setHoleImages(hole.row, hole.col);
      }
    }
  }, [props.selectedVesselHole]);

  //Get the Correction Image Path from the server
  const getCorrectionImagePath = () => {
    //Load an OME_TIFF file
    const filename = alignImages[0].filename.split('.')[0] + '.timg';
    const resultpath =
      alignImages[0].thumbnail.replace(filename, '') +
      'correction_output.ome.tiff';

    return getOmeTiffUrl(resultpath);
  };

  //Get the Normalize Image Path from the server
  const getNormalizeImagePath = () => {
    //Load an OME_TIFF file

    const filename = alignImages[0].filename.split('.')[0] + '.timg';
    const resultpath =
      alignImages[0].thumbnail.replace(filename, '') +
      'normalize_output.ome.tiff';

    return getOmeTiffUrl(resultpath);
  };

  //Get the gamma Image Path from the server
  const getGammaImagePath = (gamma) => {
    //Load an OME_TIFF file
    const filename = alignImages[0].filename.split('.')[0] + '.timg';
    const resultpath =
      alignImages[0].thumbnail.replace(filename, '') +
      'gamma' +
      gamma.toString() +
      '_output.ome.tiff';

    return getOmeTiffUrl(resultpath);
  };

  //Get the Snap To Edge Image Path from the server
  const getSnapToEdgeImagePath = () => {
    //Load an OME_TIFF file
    const filename = alignImages[0].filename.split('.')[0] + '.timg';
    const resultpath =
      alignImages[0].thumbnail.replace(filename, '') + 'snap_to_edge.ome.tiff';
    return getOmeTiffUrl(resultpath);
  };

  //Get the result image path from the server
  const getResultPath = () => {
    //Load an OME_TIFF file
    const filename = alignImages[0].filename.split('.')[0] + '.timg';

    const resultpath =
      alignImages[0].thumbnail.replace(filename, '') + 'result.ome.tiff';

    //console.log(resultpath);

    return getOmeTiffUrl(resultpath);
  };

  //when the tiles loaded, return the sort tiles by field
  const sorted = useMemo(() => {
    if (!tiles || tiles.length === 0) return [];
    if (sortOrder === SortOrder.ascending) {
      if (tiles.length > 0) {
        if (!tiles[0].field) return tiles;
      }
      return tiles.sort(
        (a, b) => Number(a.field.split('f')[1]) - Number(b.field.split('f')[1]),
      );
    } else {
      return tiles.sort(
        (a, b) => Number(b.field.split('f')[1]) - Number(a.field.split('f')[1]),
      );
    }
  }, [tiles]);

  // return tiles aligned in alignment function
  const alignedImageList = useMemo(() => {
    let sortedTiles;
    if (!alignImages || alignImages.length === 0) return [];
    if (alignImages.length > 1 && alignImages[0].field) {
      if (sortOrder === SortOrder.ascending) {
        sortedTiles = alignImages.sort(
          (a, b) =>
            Number(a.field.split('f')[1]) - Number(b.field.split('f')[1]),
        );
      } else
        sortedTiles = alignImages.sort(
          (a, b) =>
            Number(b.field.split('f')[1]) - Number(a.field.split('f')[1]),
        );
    } else sortedTiles = alignImages;

    //console.log(sortedTiles);

    if (!dim) {
      return alignImages;
    }

    //console.log(sortedTiles);

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
  }, [sorted, align, dir, dim, sortOrder, alignImages]);

  // When the row is changed in alignment part
  const inputTilingRows = (event) => {
    if (!alignImages || alignImages.length === 0) return;
    let r = Number(event.target.value);
    if (r <= 0) r = 1;
    setAlignRow(event.target.value === '' ? '' : r);
    if (alignImages) {
      if (alignImages.length < r) {
        setAlignRow(alignImages.length);
        setAlignCol(1);
        setDim([alignImages.length, 1]);
      } else {
        let c = Math.ceil(alignImages.length / r);
        setAlignCol(c);
        setDim([r, c]);
      }
    }
  };

  // When the col is changed in alignment part
  const inputTilingCols = (event) => {
    if (!alignImages) return;
    let c = Number(event.target.value);
    if (c <= 0) c = 1;
    setAlignCol(event.target.value === '' ? '' : c);

    if (alignImages) {
      if (alignImages.length < c) {
        setAlignCol(alignImages.length);
        setAlignRow(1);
        setDim([1, alignImages.length]);
      }
      let r = Math.ceil(alignImages.length / c);
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

  // const handleAlignViewClicked = () => {};

  //When the alignment Image buttons are clicked
  const handleAlignment = (event) => {
    const v = event.target.name;
    setInfoMessage(`${v} options was clicked.`);
  };

  //when the radio button in alignment was changed
  const handleAlignOptionChange = (e) => {
    if (e.target.value === 'Up-Down') {
      if (dir === Directions.horizontal) {
        setDir(Directions.vertical);
      } else setDir(Directions.horizontal);
    } else if (e.target.value === 'Left-Right') {
      if (align === Alignments.raster) {
        setAlign(Alignments.snake);
      } else setAlign(Alignments.raster);
    } else if (e.target.value === 'DecendingOrder') {
      if (sortOrder === SortOrder.ascending) setSortOrder(SortOrder.descending);
      else setSortOrder(SortOrder.ascending);
    }
  };

  const SnapToEdge = () => {
    setInfoMessage('Activate Snap To Edge Function');
    setResultImagePath(getSnapToEdgeImagePath());
    setFinalResultImagePath(getSnapToEdgeImagePath());
    setInfoMessage('Snap To Edge function finished.');
  };

  const PatternMatching = () => {
    setInfoMessage('Pattern Matching Function started');
    setResultImagePath(getSnapToEdgeImagePath());
    setFinalResultImagePath(getSnapToEdgeImagePath());
    setInfoMessage('Pattern matching finished.');
  };
  const autoPatternMatching = () => {};

  //When the radio button in bonding was changed
  const handleChange = (event) => {
    if (event.target.id === '3') {
      if (tilingBondingPatternMatch === false) {
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

    if (event.target.id === '1') {
      normalizeImgLuminance();
    }
  };

  const normalizeImgLuminance = () => {
    setInfoMessage('Normalize started.');
    setResultImagePath(getNormalizeImagePath());
    setFinalResultImagePath(getNormalizeImagePath());
    setInfoMessage('Normalizing Image finished.');
  };
  const correctLighting = () => {
    setInfoMessage('Correction started.');
    setResultImagePath(getCorrectionImagePath());
    setFinalResultImagePath(getCorrectionImagePath());
    setInfoMessage('Correction Image finished.');
  };
  const decreaseImgLuminance = () => {
    setGamma(gamma - 1);
    handleChangeLuminance(gamma - 1);
  };
  const increaseImgLuminance = () => {
    setGamma(gamma + 1);
    handleChangeLuminance(gamma + 1);
  };

  const handleChangeLuminance = (gamma) => {
    setResultImagePath(getGammaImagePath(gamma));
    setFinalResultImagePath(getGammaImagePath(gamma));
    setInfoMessage(
      'Brighten Image by Gamma.Gamma Value : ' + (gamma / 10).toString(),
    );
  };

  const resetImgLuminance = () => {
    setGamma(10);
    handleChangeLuminance(10);
  };
  const bestFit = async () => {
    handleChangeLuminance(11);
    setInfoMessage('Best Fit Image has been Display.');
  };

  useEffect(() => {
    //console.log(selectedImage);
  }, [selectedImage]);

  // When the list item of Edting is changed
  const handleListContentItemClick = async (event, index) => {
    if (holeImageList.length > 0) {
      setSelectedImageFileIndex(index);
      setResultImagePath(getOmeTiffUrl(holeImageList[index].url));
    }
  };

  const onClickedBuildButton = async () => {
    if (alignImages && alignImages.length > 0) {
      const filepath = alignImages[0].thumbnail.split('/static/')[1];
      const filename = alignImages[0].filename.split('.')[0];
      const dir_name = filepath.split(filename)[0].trim();

      const ashlarParams = {
        width: alignCol,
        height: alignRow,
        layout: align,
        direction: dir,
        dirname: dir_name,
      };

      setInfoMessage('Build Started');
      const output = await buildPyramid(ashlarParams);

      //console.log(output);

      const outputUrl = getResultPath();
      setFinalResultImagePath(outputUrl);
      setResultImagePath(outputUrl);
      setInfoMessage(
        'Build Finished. You can see the result Image in result page.',
      );
    } else {
      setInfoMessage('There is no image to merge, please check the images.');
    }
  };

  //When the list item clicked in left tab in the Tiling Part
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setInfoMessage('');

    if (index === 3 || index === 4) {
    }
    if (index === 5) {
      setInfoMessage('Result Image is displayed here.');
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
                  {holeImageList !== undefined && holeImageList !== null ? (
                    <List>
                      {holeImageList.map((item, idx) => {
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
            {selectedIndex === 0 && displayEditingEnabled === false && (
              <Paper
                variant="outlined"
                sx={{ height: '800px', width: '600px' }}
              >
                <TransformWrapper minScale={0.2}>
                  <TransformComponent
                    wrapperStyle={{ height: '800px', width: '600px' }}
                  >
                    <ImageList
                      cols={1}
                      sx={{
                        mb: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      {holeImageList.map(({ _id, thumbnail, filename }) => (
                        <>
                          <p style={{ fontFamily: 'monospace' }}>{filename}</p>
                          <ImageListItem key={_id}>
                            <img
                              src={thumbnail}
                              alt={filename}
                              style={{ width: 200, height: 'auto' }}
                            />
                          </ImageListItem>
                        </>
                      ))}
                    </ImageList>
                  </TransformComponent>
                </TransformWrapper>
              </Paper>
            )}
            {selectedIndex === 0 && displayEditingEnabled === true && (
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
                      {alignedImageList.map(({ _id, thumbnail, filename }) => (
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

            {selectedIndex === 1 && (
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
                      {alignedImageList.map(({ _id, thumbnail, filename }) => (
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

            {(selectedIndex === 2 ||
              selectedIndex === 3 ||
              selectedIndex === 4) && (
              <Avivator type={'tiling'} source={resultImagePath} />
            )}
            {selectedIndex === 5 && (
              <Avivator type={'tiling'} source={finalResultImagePath} />
            )}
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
  selectedVesselIdx: state.vessel.currentVesselSeriesIdx,
});

export default connect(mapStateToProps)(TabTiling);
