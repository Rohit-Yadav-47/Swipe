## Application Overview

Hosted Link : https://swipe-atn1.onrender.com/

This application is a **Data Management Dashboard** designed for handling invoices, products, and customer data. It allows users to upload files, edit data, and manage it through a dynamic and user-friendly interface. The app also leverages **Generative AI** to process data from uploaded files (PDF, Excel, and images), extract meaningful information, and populate the dashboard automatically.

---

## Features

### Core Features:
1. **File Upload & AI Integration**:
   - Supports file uploads in PDF, Excel, and image formats.
   - Uses **Google Generative AI** to extract structured data from these files.
   - Automatically categorizes extracted data into invoices, products, and customers.

2. **Dynamic Tabs**:
   - **Invoices Tab**:
     - Add, edit, and view invoices.
     - Validate invoice details dynamically.
   - **Products Tab**:
     - Manage products with unit prices, taxes, and inventory details.
     - Edit fields and update related invoices dynamically.
   - **Customers Tab**:
     - Track customer details including phone numbers and total spend.
     - Validate customer names and phone numbers.

3. **Summary Metrics**:
   - Each tab provides real-time metrics:
     - Total counts, amounts, or inventory values.
     - Average values where applicable.

4. **Error Handling**:
   - Highlights validation errors during edits.
   - Displays error/success notifications for uploads and AI processing.

5. **State Management**:
   - Centralized state management using **Redux**.
   - Efficient actions to add, update, and clear data.

---

## Project Architecture

### Technology Stack:
- **Frontend**:
  - React.js with Material-UI components.
  - Redux for state management.
  - Google Generative AI for data extraction.

- **Libraries**:
  - `pdfjs-dist` for PDF processing.
  - `XLSX` and `html2canvas` for Excel to image conversion.
  - `@mui/x-data-grid` for data table management.

---

### File Structure

- **Reducers**:
  - `dataReducer.js`: Manages invoices, products, and customers state.
  - Combines reducers in `index.js` for a unified state management system.

- **Actions**:
  - `dataActions.js`: Provides Redux actions to manipulate data (add, update, clear).

- **Components**:
  - **Tabs** (`Tabs.js`): Dynamic navigation for invoices, products, and customers.
  - **Invoices Tab** (`InvoicesTab.js`): Handles invoice data, includes validation and summary.
  - **Products Tab** (`ProductsTab.js`): Manages product inventory and updates invoices.
  - **Customers Tab** (`CustomersTab.js`): Displays and updates customer details.
  - **File Upload** (`FileUpload.js`): Handles file uploads, AI processing, and data extraction.

---

### AI Integration

**Google Generative AI** plays a pivotal role:
- Extracts structured data from uploaded files using a prompt-based system.
- Converts PDF, Excel, or image files into JSON with specific fields for invoices, products, and customers.

Example of AI data extraction format:
```json
{
  "invoices": [{ "serialNumber": "123", "customerName": "John Doe", "productName": "Widget", "qty": 2, "tax": 18, "totalAmount": 236, "date": "2024-01-01" }],
  "products": [{ "id": "P123", "name": "Widget", "quantity": 50, "unitPrice": 100, "tax": 18, "priceWithTax": 118, "discount": 5 }],
  "customers": [{ "id": "C123", "customerName": "John Doe", "phoneNumber": "1234567890", "totalAmount": 236 }]
}
```

---

## Installation and Usage

### Prerequisites
1. Node.js and npm installed.
2. Google Generative AI API key.

### Steps:
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add a `.env` file with your API key:
   ```
   REACT_APP_AI_API_KEY=your_google_ai_api_key
   ```
4. Start the application:
   ```bash
   npm start
   ```

---

## Key Screens

### File Upload
- Allows users to upload supported files.
- Provides real-time feedback on AI processing status.

### Invoices Tab
- Displays all invoices in a data grid.
- Enables inline editing and real-time validation.

### Products Tab
- Showcases products with dynamic fields like unit price and inventory value.
- Syncs updates with related invoices.

### Customers Tab
- Tracks customer details and total amounts from invoices.
- Supports editing with validation.

---

## Example Workflow

1. **Upload a File**:
   - Select a PDF or Excel file containing invoice data.
   - Wait for AI to process and extract data.
   - Data populates into invoices, products, and customers tabs.

2. **View & Edit Data**:
   - Navigate through tabs to review data.
   - Correct or add missing information using inline editing.

3. **Manage State**:
   - Use actions to clear or update data across the tabs.

---

## Limitations and Future Enhancements

### Current Limitations:
- AI model relies on accurate prompts and clean file input.
- Processing large files might increase response time.

### Planned Enhancements:
- Support for multiple file uploads.
- Improved AI prompts for greater data extraction accuracy.
- Advanced filtering and search capabilities in data grids.

---
