import React from 'react';

import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addInvoices, addProducts, addCustomers } from '../actions/dataActions';
import * as XLSX from 'xlsx';
import { getDocument } from 'pdfjs-dist/webpack';
import html2canvas from 'html2canvas';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

function FileUpload() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  // Initialize the AI client using the API key from environment variables
  const genAI = new GoogleGenerativeAI("AIzaSyAD7HM874Wf6UezKL27-G7T4Gpj_nXvkzc");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    try {
      setLoading(true);

      let imageBlob;

      if (
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileType === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.xlsx')
      ) {
        imageBlob = await convertExcelToImage(file);
      } else if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
        imageBlob = await convertPDFToImage(file);
      } else if (fileType.startsWith('image/')) {
        imageBlob = file;
      } else {
        setErrorMessage('Unsupported file format');
        setLoading(false);
        return;
      }

      const prompt = `Extract the invoice data from the provided image and return a JSON response with the following structure:
{
  "invoices": [{ "serialNumber": string, "customerName": string, "productName": string, "qty": number, "tax": number, "totalAmount": number, "date": string }],
  "products": [{ "id": string, "name": string, "quantity": number, "unitPrice": number, "tax": number, "priceWithTax": number, "discount": number }],
  "customers": [{ "id": string, "customerName": string, "phoneNumber": string, "totalAmount": number }]
}`;
      const responseText = await callAIModel(imageBlob, prompt);
      processAIResponse(responseText, dispatch);

      setLoading(false);
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('Error processing file');
      setLoading(false);
    }
  };

  const callAIModel = async (imageBlob, promptText) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      const dataUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });

      // Extract mimeType and base64 data
      const [header, base64Data] = dataUrl.split(',');
      const mimeTypeMatch = header.match(/data:(.*);base64/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : '';

      // Get the model instance
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Create the image part
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };

      // Generate content with the prompt and image
      const result = await model.generateContent([
        promptText,
        imagePart
      ]);

      // Get the response text
      let response = await result.response.text();
      console.log('Raw AI Model Response:', response);
      response=response.replace(/```json/g, '').replace(/```/g, '');
      
      return response;
    } catch (error) {
      console.error('AI Model Error:', error);
      throw new Error('Error calling AI model');
    }
  };

  const convertExcelToImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet);

        const container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        await html2canvas(container).then((canvas) => {
          canvas.toBlob((blob) => {
            resolve(blob);
            document.body.removeChild(container);
          });
        });
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const convertPDFToImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    });
  };

  const processAIResponse = (responseText, dispatch) => {
    try {
      const extractedData = JSON.parse(responseText);
      console.log('Raw Extracted Data:', extractedData);

      // Calculate total amount for each customer from invoices
      const customerTotals = {};

      // First process invoices to calculate totals
      extractedData.invoices.forEach(invoice => {
        const customerName = invoice.customerName;
        const amount = Number(invoice.totalAmount);
        
        if (!customerTotals[customerName]) {
          customerTotals[customerName] = 0;
        }
        
        if (!isNaN(amount)) {
          customerTotals[customerName] += amount;
        }
      });

      console.log('Customer Totals:', customerTotals);

      // Update customers with their total amounts
      const customersWithTotals = extractedData.customers.map(customer => {
        const total = customerTotals[customer.customerName] || 0;
        console.log(`Setting total for ${customer.customerName}:`, total);
        
        return {
          ...customer,
          id: customer.id || `customer_${Math.random().toString(36).substr(2, 9)}`,
          totalAmount: Number(total) // Ensure it's a number
        };
      });

      console.log('Final Customers Data:', customersWithTotals);

      // Add new data
      dispatch(addInvoices(extractedData.invoices));
      dispatch(addProducts(extractedData.products));
      dispatch(addCustomers(customersWithTotals));

      setSuccessMessage('Data extracted and loaded successfully!');
    } catch (error) {
      console.error('Error processing AI response:', error);
      setErrorMessage('Failed to process AI response.');
    }
  };

  return (
    <div>
      <Button variant="contained" component="label" disabled={loading}>
        {loading ? (
          <>
            <CircularProgress size={24} color="inherit" />
            &nbsp;Processing...
          </>
        ) : (
          'Upload File'
        )}
        <input
          hidden
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,image/*"
          onChange={handleFileUpload}
        />
      </Button>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </div>
  );
}

export default FileUpload;
