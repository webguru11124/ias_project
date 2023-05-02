import BoxCenter from '@/components/mui/BoxCenter';
import DataTable from '@/components/mui/DataTable';
import DialogContent from '@/components/mui/DialogContent';
import useMetadata from '@/hooks/useMetadata';
import useTilingStore from '@/stores/useTilingStore';
import { Box, DialogActions } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { Typography } from 'react-md';
import { METADATA_COLUMNS } from './constants';

export default function TabMetadata() {
  const { tiles } = useTilingStore();
  const [infoMessage, setInfoMessage] = useState();

  //console.log(tiles);

  const urls = useMemo(
    () =>
      tiles
        .filter((tile) => /tif?f|jpg|jpeg|png|JPG|PNG/.test(tile.path))
        .map((img) => img.url),
    [tiles],
  );

  //console.log(urls);

  const [metadata, loading] = useMetadata(urls);

  useEffect(() => {
    if (metadata == undefined || metadata == null || metadata.length == 0) {
      setInfoMessage('There is no metadata to display');
    } else {
      setInfoMessage(`${metadata.length} metadata was displayed`);
    }
  }, [metadata]);
  //console.log(metadata);

  const rows = useMemo(
    () =>
      metadata.map((data, idx) => ({
        ...data,
        ...data.Pixels,
        id: idx + 1,
      })),
    [metadata],
  );

  return (
    <>
      <DialogContent dividers sx={{ height: '100%' }}>
        {loading ? (
          <BoxCenter height="100%">
            <CircularProgress />
          </BoxCenter>
        ) : (
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataTable
              columns={METADATA_COLUMNS}
              rows={rows}
              type={'TabMetadata'}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Typography sx={{ flexGrow: 1 }}>{infoMessage}</Typography>
      </DialogActions>
    </>
  );
}
