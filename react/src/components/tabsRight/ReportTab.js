import * as React from 'react';
import { useEffect } from 'react';
import SmallCard from '../custom/SmallCard';
import TabItem from '../custom/TabItem';
import { useFlagsStore } from '@/state';
import VisualDialog from './contents/report/VisualDialog';
// import Divider from '@mui/material/Divider';
import CustomButton from '../custom/CustomButton';
import {
  mdiCloudOutline,
  mdiFileExcel,
  mdiFileExcelOutline,
  mdiFile,
  mdiEyeOutline,
  mdiTable,
} from '@mdi/js';
// import fs from 'fs';
// const dampleData = [{firstName}];

export default function ReportTab() {
  const DialogVisualFlag = useFlagsStore((store) => store.DialogVisualFlag);
  const ReportVisualFlag = useFlagsStore((store) => store.ReportVisualFlag);

  const onClick1 = () => {};
  const onClick2 = () => {};
  const onClick4 = () => {};
  const handleClickVisual = () => {
    // useFlagsStore.setState({ DialogVisualFlag: true });
    useFlagsStore.setState({ ReportVisualFlag: true });
  };

  const downloadCSV = async () => {
    // Download CSV file
    const response = await fetch('./1.csv');
    const csvData = await response.text();
    // Create new directory if it doesn't exist
    // const dirName = './';
    // if (!fs.existsSync(dirName)) {
    //   fs.mkdirSync(dirName);
    // }

    // Write CSV data to file in new directory
    const fileName = `./.csv`;
    // fs.writeFileSync(fileName, csvData);

    // console.log(`File saved successfully in ${dirName}`);
  };

  useEffect(() => {
    return () => {
      useFlagsStore.setState({ ReportVisualFlag: false });
    };
  }, []);

  const onClick6 = () => {};
  return (
    <TabItem title="Report">
      {/* <p className='mt-4'>Save</p> */}
      <SmallCard title="Save & Export">
        <CustomButton icon={mdiCloudOutline} label="Cloud" click={onClick1} />
        <CustomButton icon={mdiFileExcel} label="Excel" click={onClick2} />
        <CustomButton
          icon={mdiFileExcelOutline}
          label="CSV"
          click={downloadCSV}
        />
        <CustomButton icon={mdiFile} label="hdf5" click={onClick4} />
      </SmallCard>
      {/* {DialogVisualFlag && <VisualDialog />} */}
      {/* <p className='mt-4'>View</p> */}
      <SmallCard title="View">
        <CustomButton
          icon={mdiEyeOutline}
          label="visual"
          click={handleClickVisual}
        />
        <CustomButton icon={mdiTable} label="tableau" click={onClick6} />
      </SmallCard>
    </TabItem>
  );
}
