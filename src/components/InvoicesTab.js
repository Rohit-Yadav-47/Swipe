import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Stack, Alert, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { clearInvoices, updateInvoice } from '../actions/dataActions';

function InvoicesTab() {
  const [validationErrors, setValidationErrors] = React.useState({});

  const invoices = useSelector((state) =>
    state.data.invoices.map((invoice, index) => ({
      id: `${invoice.serialNumber}_${index}`,
      serialNumber: invoice.serialNumber || '',
      customerName: invoice.customerName || '',
      productName: invoice.productName || '',
      qty: invoice.qty ?? 0,
      tax: invoice.tax ?? 0,
      totalAmount: invoice.totalAmount ?? 0,
      date: invoice.date || '',
    }))
  );

  const products = useSelector((state) => state.data.products);
  const customers = useSelector((state) => state.data.customers);

  const dispatch = useDispatch();

  const validateField = (field, value, row) => {
    switch (field) {
      case 'productName':
        return products.some(p => p.name === value) ? null : 'Product not found';
      case 'customerName':
        return customers.some(c => c.customerName === value) ? null : 'Customer not found';
      case 'qty':
        return value > 0 ? null : 'Quantity must be greater than 0';
      case 'tax':
        return value >= 0 ? null : 'Tax must be non-negative';
      case 'date':
        return /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : 'Invalid date format (YYYY-MM-DD)';
      default:
        return value ? null : 'This field is required';
    }
  };

  const columns = [
    { field: 'serialNumber', headerName: 'Serial Number', width: 150, editable: true, headerAlign: 'center', align: 'center' },
    { field: 'customerName', headerName: 'Customer Name', width: 200, editable: true, headerAlign: 'center', align: 'left' },
    { field: 'productName', headerName: 'Product Name', width: 200, editable: true, headerAlign: 'center', align: 'left' },
    { field: 'qty', headerName: 'Quantity', width: 120, editable: true, type: 'number', headerAlign: 'center', align: 'center' },
    { field: 'tax', headerName: 'Tax', width: 100, editable: true, type: 'number', headerAlign: 'center', align: 'center' },
    { 
      field: 'totalAmount', 
      headerName: 'Total Amount', 
      width: 150, 
      editable: true, 
      type: 'number', 
      headerAlign: 'center', 
      align: 'right',
      cellClassName: 'amount-cell',
    },
    { field: 'date', headerName: 'Date', width: 150, editable: true, headerAlign: 'center', align: 'center' },
  ];

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props;
      const updatedInvoice = invoices.find((invoice) => invoice.id === id);
      if (!updatedInvoice) return;

      const error = validateField(field, data.value, updatedInvoice);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [id]: { ...prev[id], [field]: error }
        }));
        return;
      }

      updatedInvoice[field] = data.value;

      // Update totalAmount after editing product name or quantity
      if (field === 'productName' || field === 'qty' || field === 'tax') {
        const product = products.find(p => p.name === updatedInvoice.productName);
        if (product) {
          const baseAmount = updatedInvoice.qty * product.unitPrice;
          const taxAmount = updatedInvoice.tax;
          updatedInvoice.totalAmount = baseAmount + taxAmount;
        }
      }

      dispatch(updateInvoice({ ...updatedInvoice }));

      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          delete newErrors[id][field];
          if (Object.keys(newErrors[id]).length === 0) {
            delete newErrors[id];
          }
        }
        return newErrors;
      });
    },
    [dispatch, invoices, products]
  );

  const handleClear = () => {
    dispatch(clearInvoices());
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Invoice Management
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Clear All Invoices
          </Button>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'primary.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Invoices
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              {invoices.length}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'success.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Amount
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              ₹{invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}
            </Typography>
          </Paper>
        </Box>

        {hasErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please correct the highlighted fields
          </Alert>
        )}

        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={invoices}
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
            getRowClassName={(params) => validationErrors[params.id] ? 'error-row' : ''}
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
              '& .MuiDataGrid-cell.MuiDataGrid-cell--textLeft': { color: 'black !important' },
              '& .MuiDataGrid-cell.MuiDataGrid-cell--textRight': { color: 'black !important' },
              '& .MuiDataGrid-cell.MuiDataGrid-cell--textCenter': { color: 'black !important' },
              '& .amount-cell': { color: 'black !important' },
              '& .MuiDataGrid-editInputCell': { color: 'black !important' },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export default InvoicesTab;
