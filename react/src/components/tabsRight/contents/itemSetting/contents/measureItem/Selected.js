import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';

export default function Selected(props) {
  const [items, setItems] = useState([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [selectedItem, setSelectedItem] = useState(-1);

  useEffect(() => {
    setItems(props.items);
    setUpdatedAt(props.updatedAt);
  }, [props]);

  const selectItem = (item) => {
    props.onSelectItem(item);
    setSelectedItem(item);
  };

  return (
    <div
      className="d-flex"
      style={{ width: '42%', alignItems: 'center', flexDirection: 'column' }}
    >
      <DialogTitle>Selected</DialogTitle>
      <div
        className="border border-black border-solid border-2"
        style={{
          height: '320px',
          width: '100%',
          overflow: 'hidden',
          overflowY: 'scroll',
        }}
      >
        <ul className="measure-item-list">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                selectItem(item);
              }}
              className={item == selectedItem ? 'selected' : ''}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
