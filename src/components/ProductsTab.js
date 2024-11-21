import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Box, Typography, Paper, Stack, Alert, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateProduct, clearProducts } from '../actions/dataActions';

function ProductsTab() {
  const [validationErrors, setValidationErrors] = React.useState({});

  // Fetch products from the store
  const products = useSelector((state) =>
    state.data.products.map((product, index) => ({
      id: product.id || `product_${index}`,
      name: product.name || '',
      quantity: product.quantity || 0,
      unitPrice: product.unitPrice ? `₹${Number(product.unitPrice).toLocaleString()}` : '',
      tax: product.tax ? `${Number(product.tax)}%` : '',
      priceWithTax: product.priceWithTax ? `₹${Number(product.priceWithTax).toLocaleString()}` : '',
      discount: product.discount || 0,
    }))
  );

  const invoices = useSelector((state) => state.data.invoices);
  const dispatch = useDispatch();

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.length >= 3 ? null : 'Name must be at least 3 characters';
      case 'quantity':
        return value >= 0 ? null : 'Quantity must be non-negative';
      case 'unitPrice':
        return value > 0 ? null : 'Price must be greater than 0';
      case 'tax':
        return value >= 0 && value <= 100 ? null : 'Tax must be between 0 and 100';
      default:
        return null;
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200, editable: true },
    { field: 'quantity', headerName: 'Quantity', width: 120, editable: true },
    { 
      field: 'unitPrice', 
      headerName: 'Unit Price', 
      width: 120, 
      editable: true, 
      type: 'string',  // Display as string since it's formatted with the currency symbol
      headerAlign: 'center', 
      align: 'right',
      cellClassName: 'amount-cell' 
    },
    { 
      field: 'tax', 
      headerName: 'Tax', 
      width: 100, 
      editable: true, 
      type: 'string',  // Display as string since it's formatted with a percentage symbol
      cellClassName: 'amount-cell' 
    },
    { 
      field: 'priceWithTax', 
      headerName: 'Price with Tax', 
      width: 150, 
      headerAlign: 'center', 
      align: 'right',
      type: 'string',  // Display as string since it's formatted with the currency symbol
      cellClassName: 'amount-cell' 
    },
    { field: 'discount', headerName: 'Discount', width: 120, editable: true },
  ];

  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props;
      const updatedProduct = products.find((product) => product.id === id);

      const error = validateField(field, data.value);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [id]: { ...prev[id], [field]: error }
        }));
        return;
      }

      updatedProduct[field] = data.value;

      // Update related invoices if product name changes
      if (field === 'name') {
        const relatedInvoices = invoices.filter(
          invoice => invoice.productName === updatedProduct.name
        );
        relatedInvoices.forEach(invoice => {
          dispatch(updateProduct({
            ...invoice,
            productName: data.value
          }));
        });
      }

      dispatch(updateProduct({ ...updatedProduct }));
    },
    [dispatch, products, invoices]
  );

  const handleClear = () => {
    dispatch(clearProducts()); // Clear all products
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Clear All Products
          </Button>
        </Box>

        <Divider />

        {/* Stats Summary */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'primary.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Products
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              {products.length}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'success.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Total Inventory Value
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              ₹{products.reduce((sum, prod) => sum + ((prod.unitPrice * prod.quantity) || 0), 0).toLocaleString()}
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 200, bgcolor: 'info.light' }}>
            <Typography variant="h6" sx={{ color: 'black' }}>
              Average Unit Price
            </Typography>
            <Typography variant="h4" sx={{ color: 'black', fontWeight: 600 }}>
              ₹{products.length ? (products.reduce((sum, prod) => sum + (prod.unitPrice || 0), 0) / products.length).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}
            </Typography>
          </Paper>
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={products}
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

export default ProductsTab;
