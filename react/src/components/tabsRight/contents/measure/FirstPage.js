import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFlagsStore } from '@/state';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import {
  mdiBookOpenPageVariant,
  mdiPlayCircle,
  mdiCube,
  mdiLayers,
  mdiCubeOutline,
  mdiLayersOutline,
} from '@mdi/js';
import MultilineTextBox from '@/components/custom/MultiLineText';
import store from '@/reducers';
import BasicDialog from '@/components/tabsLeft/contents/dlml/dialog/BasicDialog';

const defaultLabelList = [
  {
    id: 0,
    name: 'object',
    label_color: '#FF0000',
    map_color: '#FF0000',
    positions: [],
  },
  {
    id: 1,
    name: 'background',
    label_color: '#00FF00',
    map_color: '#00FF00',
    positions: [],
  },
];

export default function FirstPage() {
  const [information, setInformation] = useState('');
  const MLCanvasFlag = useFlagsStore((store) => store.MLCanvasFlag);
  const MLMethod = useSelector((state) => state.experiment.MLMethod);

  const experiment = useSelector(
    (state) => state.experiment.MLSelectTargetMode,
  );

  // console.log("====> first tab", experiment)

  const handleChangeInformation = (event) => {
    setInformation(event.target.value);
  };
  const liveUpdate = async () => {
    const state = store.getState();

    // store.dispatch({ type: 'set_image_path_for_avivator', content: source });
  };
  const onClick1 = () => {};
  const onClick2 = () => {};
  const onClick3 = () => {
    setInformation(
      'We use the Deep learning to analyse the image\n It separatess the cells',
    );
  };
  const onClick4 = () => {
    setInformation(
      'We use the Machine learning to analyse the image\n It highlihgts the cells',
    );
    // store.dispatch({
    //   type: 'UPDATE_ML_POPUP_STATUS',
    //   payload: true,
    // });
    useFlagsStore.setState({ DialogBasicFlag: true });
  };
  const onClick5 = () => {
    liveUpdate();
  };
  const onClick6 = () => {};
  const onClick7 = () => {};
  return (
    <>
      <p>Method Setting</p>
      <div className="">
        <SmallCard title="Analysis Method">
          <CustomButton
            icon={mdiBookOpenPageVariant}
            label="Setting Call"
            click={onClick1}
          />
          <CustomButton icon={mdiPlayCircle} label="Go" click={onClick2} />
        </SmallCard>
        <SmallCard title="Learning Method">
          <CustomButton icon={mdiCube} label="DLCall" click={onClick3} />
          <CustomButton icon={mdiLayers} label="MLCall" click={onClick4} />
          <CustomButton icon={mdiPlayCircle} label="Go" click={onClick5} />
        </SmallCard>
        <SmallCard title="Object Method">
          <CustomButton icon={mdiCubeOutline} label="DLCall" click={onClick6} />
          <CustomButton
            icon={mdiLayersOutline}
            label="MLCall"
            click={onClick7}
          />
        </SmallCard>
        <SmallCard title="Method Information">
          <MultilineTextBox
            style={{ fontSize: '12px' }}
            label="Information"
            value={information}
            onChange={handleChangeInformation}
            minRows={6}
            placeholder="Enter some description here..."
          />
        </SmallCard>
      </div>
      {<BasicDialog isMLAdvance={true} />}
    </>
  );
}
