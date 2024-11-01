export function generateSaleID() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 5)
  );
}

export function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(/([- ])/) // Split by space or hyphen, keeping the separator
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(""); // Join with the original separators intact
}

export function printReceipt(savedSale, products, customerName, amountPaid) {
  if (!amountPaid || !customerName) {
    toaster.error("Please enter the customer name and amount paid");
    return;
  }

  const totalPrice = savedSale.reduce((acc, curr) => {
    const product = products.find((p) => p.name === curr.product);
    const price = product ? product.selling_price : 0;
    return acc + price * curr.quantity;
  }, 0);

  // Define the HTML content for the receipt
  const receiptContent = `
       <div id="section-to-print" style="width: 70mm; font-family: Arial, sans-serif; line-height: 1.2;">
           <div class="receipt" style="padding: 5px;">
               <h1 style="font-size: 15px; text-align: center; margin: 0;">${localStorage.getItem("brand_name")}</h1>
               <p style="font-size: 11px; text-align: center; margin: 2px 0;">(Dealers in Mobile Phones, Accessories...)</p>
               <p style="font-size: 11px; text-align: center; margin: 2px 0;">Locate Us: Dakpema Roundabout, Tamale-Accra Road</p>
               <p style="font-size: 11px; text-align: center; margin: 2px 0;">Tel: 0244 885 589 | 0209 252 462</p>
               <hr style="border-top: 1px dashed #000; margin: 5px 0;" />

               <div style="display: flex; justify-content: space-between; font-size: 11px;">
                   <p style="margin: 0;">Cashier: <strong>UNIVERSAL MAN</strong></p>
                   <p style="margin: 0;">Customer: <strong>${capitalizeName(customerName)}</strong></p>
               </div>
               <table style="width: 100%; font-size: 11px; margin: 5px 0;">
                   <thead>
                       <tr>
                           <th style="text-align: left;">Product</th>
                           <th style="text-align: center;">Qty</th>
                           <th style="text-align: right;">Price</th>
                           <th style="text-align: right;">Total</th>
                       </tr>
                   </thead>
                   <tbody>
                       ${savedSale
                         .map((saleProduct) => {
                           const product = products.find(
                             (p) => p.name === saleProduct.product,
                           );
                           const price = product ? product.selling_price : 0;
                           const total = price * saleProduct.quantity;
                           return `
                               <tr>
                                   <td style="text-align: left;">${saleProduct.product}</td>
                                   <td style="text-align: center;">${saleProduct.quantity}</td>
                                   <td style="text-align: right;">₵${price.toFixed(2)}</td>
                                   <td style="text-align: right;">₵${total.toFixed(2)}</td>
                               </tr>`;
                         })
                         .join("")}
                   </tbody>
               </table>
               <hr style="border-top: 1px dashed #000; margin: 5px 0;" />

               <div style="display: flex; justify-content: space-between; font-size: 11px;">
                   <p style="margin: 0;">Purchase Total: <strong>GH₵ ${totalPrice.toFixed(2)}</strong></p>
                   <p style="margin: 0;">Amount Paid: <strong>GH₵ ${Number(amountPaid).toFixed(2)}</strong></p>
               </div>
               <div style="display: flex; justify-content: space-between; font-size: 11px;">
                   <p style="margin: 0;">Change: <strong>GH₵ ${(amountPaid - totalPrice).toFixed(2)}</strong></p>
                   <p style="margin: 0;">Total Due: <strong>GH₵ ${(totalPrice - amountPaid).toFixed(2) > 0 ? (totalPrice - amountPaid).toFixed(2) : "0.00"}</strong></p>
               </div>
               <p style="font-size: 11px; margin: 2px 0;">Date: ${new Date().toLocaleString()}</p>
               <p style="font-size: 11px; margin: 2px 0;">MoMo Number: <strong>055 7960 396</strong></p>
               <p style="font-size: 11px; margin: 2px 0;">Sale ID: <strong>${generateSaleID().toUpperCase()}</strong></p>
               <p style="font-size: 11px; font-style: italic; text-align: center; margin: 5px 0;">Thank you for your patronage!</p>
           </div>
       </div>`;

  // Create and configure the iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "70mm";
  iframe.style.height = "auto";
  iframe.style.left = "-9999px"; // Move it off-screen
  document.body.appendChild(iframe);

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(receiptContent);
  iframe.contentWindow.document.close();

  // Add custom print styles with a script
  const printScript = document.createElement("script");
  const documentHeight = iframe.contentWindow.document.body.offsetHeight + 10; // Offset height for padding

  printScript.innerHTML = `
       function setPrintStyles(pagesize) {
           var css = \`@media print { @page { size: \${pagesize} ${documentHeight}px; } }\`;
           var style = document.createElement('style');
           document.head.appendChild(style);
           style.type = 'text/css';
           style.appendChild(document.createTextNode(css));
       }
       setPrintStyles('70mm');
       window.print();
     `;

  iframe.contentWindow.document.body.appendChild(printScript);

  iframe.contentWindow.onafterprint = () => {
    document.body.removeChild(iframe);
  };
  navigate("/sales/add/");
}
