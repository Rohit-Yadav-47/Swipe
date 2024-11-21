const initialState = {
    invoices: [],
    products: [],
    customers: [],
  };
  
  export default function dataReducer(state = initialState, action) {
    switch (action.type) {
      case 'ADD_INVOICES':
        return { ...state, invoices: [...action.payload] }; // Replace instead of append
      case 'ADD_PRODUCTS':
        return { ...state, products: [...action.payload] }; // Replace instead of append
      case 'ADD_CUSTOMERS':
        return { ...state, customers: [...action.payload] }; // Replace instead of append
      case 'UPDATE_PRODUCT':
        const updatedProducts = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        return { ...state, products: updatedProducts };
      case 'UPDATE_CUSTOMER':
        const updatedCustomers = state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        );
        return { ...state, customers: updatedCustomers };
      case 'CLEAR_INVOICES':
        return { ...state, invoices: [] };
      case 'CLEAR_PRODUCTS':
        return { ...state, products: [] };
      case 'CLEAR_CUSTOMERS':
        return { ...state, customers: [] };
      default:
        return state;
    }
  }
  