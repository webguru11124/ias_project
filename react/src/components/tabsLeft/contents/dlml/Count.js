import React from 'react';
import SmallCard from '../../../custom/SmallCard';
// import CustomButton from "../../../custom/CustomButton"
import RectangleButton from '../../../custom/RectangleButton';
import { mdiCalculator, mdiReplay, mdiArrowCollapseVertical } from '@mdi/js';
import store from '@/reducers';
export default function Count() {
  const state = store.getState();

  const onCount = () => {
    let fullPath = state.files.imagePathForCountResult;
    if (fullPath) {
      store.dispatch({
        type: 'set_image_path_for_avivator',
        content: fullPath,
      });
    }
  };
  const onBack = () => {
    let fullPath = state.files.imagePathForResult;
    if (fullPath) {
      store.dispatch({
        type: 'set_image_path_for_avivator',
        content: fullPath,
      });
    }
  };
  const onSplit = () => {};
  return (
    <div className="">
      <SmallCard title="Count">
        <RectangleButton
          icon={mdiCalculator}
          label="Count"
          width="34"
          click={() => onCount()}
        ></RectangleButton>
        <RectangleButton
          icon={mdiReplay}
          label="Back"
          width="34"
          click={() => onBack()}
        ></RectangleButton>
        <RectangleButton
          icon={mdiArrowCollapseVertical}
          label="Split"
          width="34"
          click={() => onSplit()}
        ></RectangleButton>
        {/* <CustomButton icon={mdiCalculator} label="Count" onClick={() => onCount()} />
                <CustomButton icon={mdiReplay} label="Back" onClick={() => onBack()} />  
                <CustomButton icon={mdiArrowCollapseVertical} label="Split" onClick={() => onSplit()} />*/}
      </SmallCard>
    </div>
  );
}
