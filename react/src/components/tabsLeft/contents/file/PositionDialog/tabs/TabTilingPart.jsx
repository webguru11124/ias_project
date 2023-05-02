import { buildPyramid } from '@/api/tiling';
import DialogContent from '@/components/mui/DialogContent';
import useTilingStore from '@/stores/useTilingStore';
import {
  Button,
  DialogActions,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import store from '@/reducers';
import { NAME_BONDING_OPTIONS, NAME_TILING_OPTIONS } from './constants';
import { List } from 'semantic-ui-react';
import { ListItemText } from 'react-md';

export default function TabTiling() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState();

  const [finalImagePath, setFinalImagePath] = useState();

  const { tiles } = useTilingStore();

  //bonding option
  const [bondingSelected, setBondingSelected] = useState('None');

  const handleListItemClick = (e, idx) => {
    setSelectedIndex(idx);
  };
  const bondingOptionChanged = (e) => {
    setBondingSelected(e.target.value);
  };
  const bondingAutoButtonClicked = () => {};

  const EditingPart = (
    <>
      <h2 style={{ paddingLeft: '30px', paddingTop: '30px' }}> Editing</h2>
      <Grid container spacing={1} style={{ paddingTop: '50px' }}>
        <Grid
          item
          xs={7}
          style={{
            overflowY: 'auto',
            maxHeight: '500px',
            border: '1px solid gray',
            borderRadius: '3px',
          }}
        >
          <List component="nav" aria-label="main mailbox folders">
            {tiles.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedFile === item}
                onClick={(event) => setSelectedFile(item)}
              >
                <ListItemText primary={item.filename}>
                  {' '}
                  {item.filename}
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Grid
          item
          xs={5}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedFile ? (
            <img
              src={selectedFile.thumbnail}
              alt={selectedFile.filename}
              style={{ width: 450, height: 'auto' }}
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );

  const BondingPart = (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2
            style={{
              paddingLeft: '30px',
              paddingTop: '30px',
              paddingBottom: '50px',
            }}
          >
            {' '}
            Bonding
          </h2>
          {NAME_BONDING_OPTIONS.map((item) => {
            return (
              <div
                className="radio"
                style={{
                  paddingTop: '15px',
                  paddingLeft: '20px',
                  fontSize: '16px',
                }}
              >
                <input
                  type="radio"
                  value={item}
                  key={item}
                  checked={bondingSelected == item}
                  onChange={bondingOptionChanged}
                />
                {item}
              </div>
            );
          })}
          <div
            style={{
              paddingLeft: '20px',
              paddingTop: '30px',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextField
              id="overlapX"
              label="overlapX"
              type="number"
              variant="outlined"
              defaultValue={0}
              style={{ paddingRight: '5px' }}
            />
            <TextField
              id="overlapY"
              label="overlapY"
              type="number"
              variant="outlined"
              defaultValue={0}
              style={{ paddingRight: '5px' }}
            />
            <Button
              size="medium"
              variant="contained"
              onClick={bondingAutoButtonClicked}
            >
              {' '}
              Auto{' '}
            </Button>
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ overflow: 'auto', height: '500px' }}>
            <img src={finalImagePath} alt="Final Image" />
          </div>
        </Grid>
      </Grid>
    </>
  );

  const AlignmentPart = <></>;

  const ShadingPart = <></>;

  const DisplayPart = <></>;
  const ResultPart = <></>;

  const OptionPart = <></>;

  const Content = ({ id }) => {
    switch (id) {
      case 0:
        return EditingPart;
      case 1:
        return AlignmentPart;
      case 2:
        return BondingPart;
      case 3:
        return ShadingPart;
      case 4:
        return DisplayPart;
      case 5:
        return ResultPart;
      case 6:
        return OptionPart;
      default:
        return <></>;
    }
  };

  return (
    <>
      <DialogContent dividers sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid
            item
            container
            xl={2}
            lg={3}
            xs={2}
            sx={{ p: 2, height: 'fit-content' }}
            spacing={2}
          >
            <Grid item xs={12}>
              <List component="nav" aria-label="main mailbox folders">
                {NAME_TILING_OPTIONS.map((item) => (
                  <ListItemButton
                    key={`item-${item.id}`}
                    selected={selectedIndex === item.id}
                    onClick={(event) => handleListItemClick(event, item.id)}
                  >
                    <ListItemText
                      primary={item.name}
                      className="mb-0 font-bolder font-16"
                    >
                      {' '}
                      {item.name}
                    </ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Grid>
          </Grid>
          <Grid item xs>
            <Content id={selectedIndex} />
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
}
