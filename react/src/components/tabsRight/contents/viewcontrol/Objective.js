import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SmallCard from '@/components/custom/SmallCard';
import ObjectiveButton from '@/components/custom/ObjectiveButton';
import store from '@/reducers';

export default function Objective() {
  const [activeButton, setActiveButton] = useState(0); //id
  const objectiveData = useSelector((state) => state.measure.objective_data);
  const [activeId, setActiveId] = useState(objectiveData.id ?? 0); //id

  const objectives = [
    { id: 0, rate: 4 },
    { id: 1, rate: 10 },
    { id: 2, rate: 20 },
    { id: 3, rate: 40 },
    { id: 4, rate: 100 },
  ];

  const handleClickButton = (e, item) => {
    store.dispatch({
      type: 'UPDATE_MEASURE_OBJECTIVE_DATA',
      payload: {
        id: item.id,
        rate: item.rate,
      },
    });
    setActiveId(item.id);
  };

  return (
    <SmallCard title="Objective">
      {objectives.map((item) => {
        return (
          <ObjectiveButton
            onClick={(e, id) => handleClickButton(e, item)}
            id={item.id}
            activeId={activeId}
            label={item.rate + 'X'}
            key={item.id}
          />
        );
      })}
    </SmallCard>
  );
}
