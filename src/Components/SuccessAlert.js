import React from 'react'
import Alert from '@mui/material/Alert';

const SuccessAlert = ({msg}) => {
  return (
    <div> <Alert severity="success">{msg}</Alert></div>
  )
}

export default SuccessAlert