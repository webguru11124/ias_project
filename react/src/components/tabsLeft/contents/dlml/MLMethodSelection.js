import React from 'react';
import SmallCard from '../../../custom/SmallCard';
import CustomButton from '../../../custom/CustomButton';
import { mdiPlusBox, mdiPlayBox, mdiCog } from '@mdi/js';
import { useFlagsStore } from '@/state';
import MLMethodSelectDialog from './dialog/MLMethodSelectDialog';
import MLMethodAddDialog from './dialog/MLMethodAddDialog';
import { mdiUpdate } from '@mdi/js';
import BasicDialog from '@/components/tabsLeft/contents/dlml/dialog/BasicDialog';

export default function MLMethodSelection() {
  const showMLDialogMethodSelect = () => {
    useFlagsStore.setState({ MLDialogMethodSelectFlag: true });
  };

  const showMLDialogMethodAdd = () => {
    useFlagsStore.setState({ MLDialogMethodAddFlag: true });
  };

  const handleAdvance = () => {
    useFlagsStore.setState({ DialogBasicFlag: true });
  };
  // const closeMLDialogMethodSelect = () => {
  //   useFlagsStore.setState({MLDialogMethodSelecFlag: false})
  // }

  return (
    <SmallCard title="Method Selection">
      <div
        className="d-flex flex-row justify-content-around  w-100"
        style={{ paddingBottom: '4px' }}
      >
        <CustomButton
          icon={mdiPlusBox}
          label={`New`}
          click={() => showMLDialogMethodAdd()}
        />
        <CustomButton
          icon={mdiPlayBox}
          label={`Set`}
          click={() => showMLDialogMethodSelect()}
        />
        <CustomButton
          icon={mdiCog}
          label={`Advance`}
          click={() => handleAdvance()}
        />
      </div>
      {<MLMethodAddDialog />}
      {<MLMethodSelectDialog />}
      {<BasicDialog isMLAdvance={true} />}
    </SmallCard>
  );
}
