import BoxCenter from '@/components/mui/BoxCenter';
import DataTable from '@/components/mui/DataTable';
import DialogContent from '@/components/mui/DialogContent';
import useMetadata from '@/hooks/useMetadata';
import useTilingStore from '@/stores/useTilingStore';
import { Backdrop, Box, DialogActions, Fade, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { Typography } from 'react-md';
import { METADATA_COLUMNS } from './constants';
import { useSelector } from 'react-redux';

export default function TabMetadata() {
  const { tiles } = useTilingStore();
  const [infoMessage, setInfoMessage] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const allMetaData = useSelector((state) => state.metaData.data);
  const [selectedMetaData, setSelectedMetaData] = useState({});

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // Modal Dialog
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Render multi-tree JSON object
  const displayMetaData = (data) => {
    return (
      <ul>
        {Object.keys(data).map((key) => {
          const value = data[key];
          if (typeof value === 'object') {
            return (
              <li key={key}>
                <strong>{key}: </strong>
                {displayMetaData(value)}
              </li>
            );
          } else {
            return (
              <li key={key}>
                <strong>{key}: </strong>
                {value}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  const getOmeTiffUrl = (url) => {
    //console.log(tiles);

    const ext = url.split('.').pop();
    if (ext === 'tiff' || ext === 'tif') return url;

    const newExtension = 'ome.tiff';
    const newUrl = url.replace(/\.[^/.]+$/, `.${newExtension}`);

    return newUrl;
  };
  //console.log(tiles);

  const urls = useMemo(
    () =>
      tiles
        .filter((tile) => /tif?f|jpg|jpeg|png|JPG|PNG/.test(tile.path))
        .map((img) => getOmeTiffUrl(img.url)),
    [tiles],
  );

  //console.log(urls);
  //co//nsole.log(urls);

  const [metadata, loading] = useMetadata(urls);

  useEffect(() => {
    if (!selectedRow) {
      setOpen(false);
      return;
    }
    if (!metadata) return;

    const name = selectedRow.Name.split('.')[0];

    metadata.map((item) => {
      if (!item) return;

      if (item['Name'].includes(name)) {
        setSelectedMetaData(item);
      }
    });

    setOpen(true);
  }, [selectedRow]);

  useEffect(() => {
    if (metadata === undefined || metadata == null || metadata.length === 0) {
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
                onSelectedRow={setSelectedRow}
                type={'TabMetadata'}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Typography sx={{ flexGrow: 1 }}>{infoMessage}</Typography>
        </DialogActions>
      </>

      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <h2>Show Metadata information</h2>

              <div
                style={{
                  overflow: 'auto',
                  width: '700px',
                  height: '500px',
                  overflowY: 'auto',
                }}
              >
                {selectedMetaData &&
                  selectedMetaData !== {} &&
                  displayMetaData(selectedMetaData)}
                {/* <div style = {{width : "700px" ,  overflow:"auto"}}>{JSON.stringify(selectedMetaData)}</div> */}
              </div>
            </Box>
          </Fade>
        </Modal>
      </>
    </>
  );
}
