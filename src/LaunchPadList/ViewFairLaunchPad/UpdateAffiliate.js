import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast'; 
import { enableFairAffilateHandler } from "../../ContractAction/FairLaunchPadAction";

const UpdateAffiliate = ({ open, onClose, poolAddr , setUpdate,
  update}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      affiliateAddress: ''
    },
    validationSchema: Yup.object({
      affiliateAddress: Yup.number()
        .typeError('Must be a number')
        .required('Required')
        .min(1, 'Minimum value is 1')
        .max(5, 'Maximum value is 5')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const tx = await enableFairAffilateHandler(poolAddr, values.affiliateAddress);
        if(tx){
            toast.success('Affiliate updated successfully ✅');
        }
        setUpdate(prev => !prev);
        onClose();
      } catch (error) {
        toast.error('Failed to update affiliate ❌');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ background: (theme) => theme.palette.background.paper }}>Update Affiliate Rate</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ background: (theme) => theme.palette.background.paper }}>
          <Typography variant="body1">Enter Rate (1-5)</Typography>
          <TextField
            fullWidth
            name="affiliateAddress"
            value={formik.values.affiliateAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.affiliateAddress && Boolean(formik.errors.affiliateAddress)}
            helperText={formik.touched.affiliateAddress && formik.errors.affiliateAddress}
            variant="outlined"
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions sx={{ background: (theme) => theme.palette.background.paper }}>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="blue" /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateAffiliate;
