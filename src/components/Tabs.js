import React from 'react';
import { Tab, Tabs as MuiTabs, Box } from '@mui/material';
import InvoicesTab from './InvoicesTab';
import ProductsTab from './ProductsTab';
import CustomersTab from './CustomersTab';

function Tabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <MuiTabs 
          value={value} 
          onChange={handleChange}
          variant="fullWidth"
          TabIndicatorProps={{
            sx: {
              height: 3,
              borderRadius: '3px 3px 0 0',
            }
          }}
        >
          <Tab 
            label="Invoices" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }}
          />
          <Tab 
            label="Products" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }}
          />
          <Tab 
            label="Customers" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }}
          />
        </MuiTabs>
      </Box>
      <Box sx={{ p: 2 }}>
        {value === 0 && <InvoicesTab />}
        {value === 1 && <ProductsTab />}
        {value === 2 && <CustomersTab />}
      </Box>
    </Box>
  );
}

export default Tabs;
