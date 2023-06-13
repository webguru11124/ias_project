import React, { useEffect, useState } from 'react';
import SmallCard from '../../../custom/SmallCard';
import { mdiLightbulbOutline, mdiLightbulb } from '@mdi/js';
import Icon from '@mdi/react';
import store from '@/reducers';
import { useSelector } from 'react-redux';

export default function MLObjectBrightness() {
  const onLight = () => {
    store.dispatch({
      type: 'setMLObjectBrightnessMode',
      content: 'light',
    });
  };
  const onBlack = () => {
    store.dispatch({
      type: 'setMLObjectBrightnessMode',
      content: 'black',
    });
  };
  const MLObjectBrightnessMode = useSelector(
    (state) => state.experiment.MLObjectBrightnessMode,
  );
  const MLMethod = useSelector((state) => state.experiment.MLMethod);
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    if (MLMethod && MLMethod.params) {
      let objColor = MLMethod.params.objectLabelColor;
      let bgColor = MLMethod.params.bgLabelColor;

      let r = parseInt(objColor.slice(1, 3), 16),
        g = parseInt(objColor.slice(3, 5), 16),
        b = parseInt(objColor.slice(5, 7), 16);

      let objBrightness = Math.sqrt(
        0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b),
      );

      r = parseInt(bgColor.slice(1, 3), 16);
      g = parseInt(bgColor.slice(3, 5), 16);
      b = parseInt(bgColor.slice(5, 7), 16);
      let bgBrightness = Math.sqrt(
        0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b),
      );

      if (objBrightness > bgBrightness) {
        setIsLight(true);
      } else {
        setIsLight(false);
      }
    }
  }, [MLMethod]);

  return (
    <div className="common-border">
      {/* <h6>Object Select</h6> */}
      <SmallCard title="Prediction Export" child={true}>
        <button
          className="btn btn-light btn-sm w-50"
          style={{
            backgroundColor: isLight ? 'grey' : 'transparent',
          }}
          onClick={onLight}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiLightbulbOutline}
          ></Icon>
          LightOB
        </button>
        <button
          className="btn btn-light btn-sm w-50"
          style={{
            backgroundColor: !isLight ? 'grey' : 'transparent',
          }}
          onClick={onBlack}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiLightbulb}
          ></Icon>
          BlackOB
        </button>
        {/* <CustomButton icon={mdiLightbulbOutline} label="LightOB" onClick={() => onLight()} />
                <CustomButton icon={mdiLightbulb} label="BlackOB" onClick={() => onBlack()} /> */}
      </SmallCard>
    </div>
  );
}
