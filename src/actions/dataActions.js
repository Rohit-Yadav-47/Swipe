// actions/dataActions.js
export const addInvoices = (invoices) => ({
    type: 'ADD_INVOICES',
    payload: invoices,
  });
  
  export const addProducts = (products) => ({
    type: 'ADD_PRODUCTS',
    payload: products,
  });
  
  export const addCustomers = (customers) => ({
    type: 'ADD_CUSTOMERS',
    payload: customers,
  });
  
  export const updateProduct = (product) => ({
    type: 'UPDATE_PRODUCT',
    payload: product,
  });
  
  export const clearProducts = () => ({
    type: 'CLEAR_PRODUCTS',
  });
  export const clearInvoices = () => ({
    type: 'CLEAR_INVOICES',
  });
  export const clearCustomers = () => ({
    type: 'CLEAR_CUSTOMERS',
  });
  
  export const updateInvoice = (invoice) => ({
    type: 'UPDATE_INVOICE',
    payload: invoice,
  });
  
  export const updateCustomer = (customer) => ({
    type: 'UPDATE_CUSTOMER',
    payload: customer,
  });
    
  // Add more actions as needed
  