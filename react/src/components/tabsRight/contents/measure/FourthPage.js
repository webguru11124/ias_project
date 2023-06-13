import * as React from 'react';
import SmallCard from '../../../custom/SmallCard';
import { Button } from 'react-bootstrap';
import * as api_measure from '@/api/measure';
import { useSelector } from 'react-redux';

export default function FifthPage() {
  const measureData = useSelector((state) => state.measure);

  const handleGo = async () => {
    let res = await api_measure.uploadMeasureData(measureData);
  };
  const handleStop = () => {};

  const handleSave = async () => {
    let res = await api_measure.uploadMeasureData(measureData);
  };

  const handleCancel = () => {};
  return (
    <>
      <SmallCard title="Setting Information"></SmallCard>
      <SmallCard title="Go">
        <Button className="btn btn-light btn-sm w-16" onClick={handleGo}>
          Go
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={handleStop}>
          Stop
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={handleSave}>
          Save
        </Button>
        <Button className="btn btn-light btn-sm w-16" onClick={handleCancel}>
          Cancel
        </Button>
      </SmallCard>
    </>
  );
}
