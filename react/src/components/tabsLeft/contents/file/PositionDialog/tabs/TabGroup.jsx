import DialogContent from '@/components/mui/DialogContent';
import useTilingStore from '@/stores/useTilingStore';
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import store from '@/reducers';
import { connect } from 'react-redux';
import DataTable from '@/components/mui/DataTable';
import BoxCenter from '@/components/mui/BoxCenter';
import { List } from 'semantic-ui-react';
import { Typography } from 'react-md';

const TabGroup = (props) => {
  const { tiles, loadTiles } = useTilingStore();

  const [loading, setLoading] = useState(true);

  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    //console.log(tiles);
    if (tiles != [] || tiles != null) setLoading(false);
  }, [tiles]);

  const handleNew = async () => {};

  const handleSave = async () => {};

  return (
    <>
      <DialogContent dividers sx={{ height: '100%' }}>
        {loading ? (
          <BoxCenter height="100%">
            <CircularProgress />
          </BoxCenter>
        ) : (
          <Grid container sx={{ height: '100%' }}>
            <Grid
              item
              container
              xl={2}
              lg={3}
              xs={4}
              sx={{ p: 2, height: 'fit-content' }}
              spacing={2}
            >
              <Grid item xs={12}>
                <FormControl>
                  <Typography mr={4}>Groups:</Typography>
                  <List></List>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNew}
                  >
                    New
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xl={10} lg={9} xs={8} sx={{ height: '100%' }}></Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="warning">
          Cancel
        </Button>
      </DialogActions>
    </>
  );
};

const mapStateToProps = (state) => ({
  content: state,
});

export default connect(mapStateToProps)(TabGroup);
