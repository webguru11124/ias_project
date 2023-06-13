import React from 'react';
import { TextField } from '@material-ui/core';

function MultilineTextBox(props) {
  const { label, value, onChange, minRows, placeholder, style } = props;

  return (
    <TextField
      inputProps={{
        style: { ...style },
      }}
      label={label}
      multiline
      minRows={minRows}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      placeholder={placeholder}
      variant="outlined"
    />
  );
}

export default MultilineTextBox;
