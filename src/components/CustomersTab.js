import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Stack, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateCustomer, clearCustomers } from '../actions/dataActions';

function CustomersTab() {
  const [validationErrors, setValidationErrors] = React.useState({});

  // Fetch customers from the store
  const customers = useSelector((state) => {
    console.log('Redux State:', state.data); // Log entire data state
    console.log('Customers from Redux:', state.data.customers); // Log customers specifically
    
    return state.data.customers.map((customer, index) => ({
      id: customer.id || `customer_${index}`,
      customerName: customer.customerName || '',
      phoneNumber: customer.phoneNumber || '',
      totalAmount: customer.totalAmount || ''
    }));
  });

  const dispatch = useDispatch();

  const validateField = (field, value) => {
    switch (field) {
      case 'customerName':
        return value.length >= 3 ? null : 'Name must be at least 3 characters';
      case 'phoneNumber':
        return /^\d{10}$/.test(value) ? null : 'Phone number must be 10 digits';
      default:
        return null;
    }
  };

  const columns = [
    { field: 'customerName', headerName: 'Customer Name', width: 250, editable: true },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200, editable: true },
    { 
      field: 'totalAmount', 
      headerName: 'Total Amount', 
      width: 200, 
      editable: false,
      type: 'number',
      headerAlign: 'center',
      align: 'right'
    },
  ];

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props;
      const updatedCustomer = customers.find((customer) => customer.id === id);

      if (!updatedCustomer) return;

      const error = validateField(field, data.value);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [id]: { ...prev[id], [field]: error }
        }));
        return;
      }

      updatedCustomer[field] = data.value;
      dispatch(updateCustomer({ ...updatedCustomer }));
    },
    [dispatch, customers]
  );

  const handleClear = () => {
    dispatch(clearCustomers());
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Customer Management
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Clear All Customers
          </Button>
        </Box>

        <Divider />

        {/* Updated Stats Summary */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'primary.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Customers
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              {customers.length}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'success.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Amount
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              ₹{customers.reduce((sum, customer) => sum + (parseFloat(customer.totalAmount) || 0), 0).toLocaleString()}
            </Typography>
          </Paper>
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={customers}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7, 14, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            onCellEditCommit={handleEditCellChangeCommitted}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              '& .MuiDataGrid-cell--editing': { bgcolor: 'rgb(255,215,115, 0.19)', padding: '16px', color: 'black' },
              '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5', color: 'black', fontSize: '1.1rem' },
              '& .MuiDataGrid-virtualScroller': { bgcolor: 'background.paper' },
              '& .MuiDataGrid-footerContainer': { bgcolor: '#f5f5f5', color: 'black' },
              '& .MuiDataGrid-toolbarContainer': { bgcolor: 'background.paper', padding: 2 },
              '& .error-row': { bgcolor: 'error.lighter' },
              '& .MuiDataGrid-cell': { color: 'black !important' },
              '& .MuiTablePagination-root': { color: 'black' },
              '& .MuiButtonBase-root': { color: 'black' },
              '& .MuiDataGrid-menuIcon': { color: 'black' },
              '& .MuiDataGrid-sortIcon': { color: 'black' },
              '& .MuiDataGrid-row': { color: 'black !important' },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export default CustomersTab;
