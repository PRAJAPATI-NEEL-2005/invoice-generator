import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const InvoicePreview = ({ formData }) => {
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
      margin:       0.3,
      filename:     `Invoice-${invoiceInfo?.number || "Generated"}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const shareToWhatsApp = () => {
    const message = `Invoice from ${sender.name} to ${receiver.name} for ${currency}${total.toFixed(2)}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="text-sm">
      <div ref={printRef} className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
                        <h2 className="font-semibold">Bill From:</h2>

            <div>{sender.name}</div>
            <div>{sender.address}</div>
            <div>{sender.phone}</div>
            <div>{sender.email}</div>
          </div>
          <div>{logo && <img src={logo} alt="Logo" className="h-16" />}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="font-semibold">Bill To:</h2>
            <div>{receiver.name}</div>
            <div>{receiver.address}</div>
            <div>{receiver.phone}</div>
            <div>{receiver.email}</div>
          </div>
          <div>
            <div>Invoice Number: {invoiceInfo.number}</div>
            <div>Invoice Date: {invoiceInfo.date}</div>
            <div>Due Date: {invoiceInfo.due}</div>
          </div>
        </div>

        <table className="w-full border">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Qty</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{currency}{item.price.toFixed(2)}</td>
                <td className="p-2">{currency}{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

     <div className="text-right space-y-1 mt-2">
  <div className="grid grid-cols-2">
    <span className="text-left">Subtotal:</span>
    <span>{currency}{subtotal.toFixed(2)}</span>
  </div>
  <div className="grid grid-cols-2">
    <span className="text-left">Tax ({taxRate}%):</span>
    <span>{currency}{taxAmount.toFixed(2)}</span>
  </div>
  <div className="grid grid-cols-2">
    <span className="text-left">Fees:</span>
    <span>{currency}{parseFloat(fees).toFixed(2)}</span>
  </div>
  <div className="grid grid-cols-2">
    <span className="text-left">Discount:</span>
    <span>-{currency}{parseFloat(discount).toFixed(2)}</span>
  </div>
  <div className="grid grid-cols-2 font-bold text-lg bg-orange-500 text-white px-4 py-2 mt-2 rounded">
    <span className="text-left">TOTAL:</span>
    <span>{currency}{total.toFixed(2)}</span>
  </div>
</div>

        {terms && (
          <div>
            <h3 className="font-semibold mt-4">Terms:</h3>
            <p>{terms}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <button
          onClick={downloadInvoice}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download
        </button>
        <button
          onClick={shareToWhatsApp}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
