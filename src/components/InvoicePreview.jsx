import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { FaDownload, FaWhatsapp, FaEnvelope, FaPrint, FaFilePdf } from "react-icons/fa";

const InvoicePreview = ({ formData, darkMode }) => {
  const {
    logo,
    sender,
    receiver,
    invoiceInfo,
    items,
    currency,
    terms,
    taxRate,
    fees,
    discount
  } = formData;

  const printRef = useRef();

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount + parseFloat(fees) - parseFloat(discount);

  const downloadInvoice = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoiceInfo?.number || "Generated"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const shareToWhatsApp = () => {
    const message = `Invoice from ${sender.name} to ${receiver.name} for ${currency}${total.toFixed(2)}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const shareByEmail = () => {
    const subject = `Invoice #${invoiceInfo.number || "Generated"} from ${sender.name}`;
    const body = `Please find attached invoice #${invoiceInfo.number || "Generated"} for ${currency}${total.toFixed(2)}.\n\nDue date: ${invoiceInfo.due}\n\nRegards,\n${sender.name}`;
    
    window.location.href = `mailto:${receiver.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const printInvoice = () => {
    const printContent = document.getElementById('invoice-print-content');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className={`text-sm ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
      <div id="invoice-print-content">
        <div 
          ref={printRef} 
          className={`p-6 rounded-lg ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">INVOICE</h1>
              <div className="space-y-1">
                <h2 className="font-semibold">Bill From:</h2>
                <div className="font-medium">{sender.name}</div>
                <div className="whitespace-pre-line">{sender.address}</div>
                <div>{sender.phone}</div>
                <div>{sender.email}</div>
              </div>
            </div>
            <div className="text-right">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-20 mb-4 ml-auto" 
                />
              )}
              <div className={`inline-block px-4 py-2 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div><span className="font-medium">Invoice Number:</span> {invoiceInfo.number || "N/A"}</div>
                <div><span className="font-medium">Invoice Date:</span> {invoiceInfo.date || "N/A"}</div>
                <div><span className="font-medium">Due Date:</span> {invoiceInfo.due || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h2 className="font-semibold mb-2">Bill To:</h2>
              <div className="font-medium">{receiver.name}</div>
              <div className="whitespace-pre-line">{receiver.address}</div>
              <div>{receiver.phone}</div>
              <div>{receiver.email}</div>
            </div>
            <div className={`p-4 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {currency}{total.toFixed(2)}
                </div>
                <div className={`inline-block px-3 py-1 rounded ${
                  new Date() > new Date(invoiceInfo.due) 
                    ? "bg-red-500 text-white" 
                    : "bg-green-500 text-white"
                }`}>
                  {new Date() > new Date(invoiceInfo.due) ? "OVERDUE" : "DUE"} {invoiceInfo.due}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="text-left p-3 rounded-tl-md">Item</th>
                  <th className="text-center p-3">Qty</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3 rounded-tr-md">Amount</th>
                </tr>
              </thead>
              <tbody className={darkMode ? "bg-gray-700" : "bg-white"}>
                {items.map((item, idx) => (
                  <tr key={idx} className={`border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{currency}{item.price.toFixed(2)}</td>
                    <td className="p-3 text-right">{currency}{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {terms && (
              <div className={`flex-1 p-4 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
                <p className="whitespace-pre-line text-sm">{terms}</p>
              </div>
            )}
            
            <div className={`md:w-64 ${!terms && "ml-auto"}`}>
              <div className={`p-4 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Subtotal:</span>
                  <span className="text-right">{currency}{subtotal.toFixed(2)}</span>
                  
                  <span>Tax ({taxRate}%):</span>
                  <span className="text-right">{currency}{taxAmount.toFixed(2)}</span>
                  
                  <span>Fees:</span>
                  <span className="text-right">{currency}{parseFloat(fees).toFixed(2)}</span>
                  
                  <span>Discount:</span>
                  <span className="text-right">-{currency}{parseFloat(discount).toFixed(2)}</span>
                  
                  <span className="font-bold text-lg pt-2 border-t border-gray-300 dark:border-gray-600">TOTAL:</span>
                  <span className="text-right font-bold text-lg pt-2 border-t border-gray-300 dark:border-gray-600">
                    {currency}{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm opacity-75">
            <p>Thank you for your business!</p>
            <p>Invoice generated with Invoice Generator</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <button
          onClick={downloadInvoice}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          <FaDownload /> Download PDF
        </button>
        <button
          onClick={printInvoice}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <FaPrint /> Print
        </button>
        <button
          onClick={shareToWhatsApp}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <FaWhatsapp /> WhatsApp
        </button>
        <button
          onClick={shareByEmail}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
        >
          <FaEnvelope /> Email
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
