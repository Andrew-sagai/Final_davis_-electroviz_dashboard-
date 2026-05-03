import Papa from 'papaparse';
import type { SalesRecord } from '../types';

export async function loadCSVData(): Promise<SalesRecord[]> {
  const response = await fetch('/Electronic_sales_Sep2023-Sep2024.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const records: SalesRecord[] = results.data.map((row: any) => ({
          customerID: parseInt(row['Customer ID']?.trim() || '0'),
          age: parseInt(row['Age']?.trim() || '0'),
          gender: (row['Gender'] || '').trim(),
          loyaltyMember: (row['Loyalty Member'] || '').trim(),
          productType: (row['Product Type'] || '').trim(),
          sku: (row['SKU'] || '').trim(),
          rating: parseFloat(row['Rating']?.trim() || '0'),
          orderStatus: (row['Order Status'] || '').trim(),
          paymentMethod: (row['Payment Method'] || '').trim(),
          totalPrice: parseFloat(row['Total Price']?.trim() || '0'),
          unitPrice: parseFloat(row['Unit Price']?.trim() || '0'),
          quantity: parseInt(row['Quantity']?.trim() || '0'),
          purchaseDate: (row['Purchase Date'] || '').trim(),
          shippingType: (row['Shipping Type'] || '').trim(),
          addonsPurchased: (row['Add-ons Purchased'] || '').trim(),
          addonTotal: parseFloat(row['Add-on Total']?.trim() || '0'),
        }));
        resolve(records.filter(r => r.customerID > 0));
      },
      error: (error) => reject(error),
    });
  });
}

// Move CSV to public folder at build time — we'll copy it
export function copyCSVToPublic() {
  // This is handled by vite config or manual copy
}
