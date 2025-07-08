import React, { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";

function App() {
  const [formData, setFormData] = useState({
    items: [{ name: "Item 1", quantity: 1, price: 0 }],
    sender: { name: "", address: "", phone: "", email: "" },
    receiver: { name: "", address: "", phone: "", email: "" },
    invoiceInfo: { number: "", date: "", due: "" },
    terms: "",
    currency: "$",
    logo: null,
    taxRate: 5,
    fees: 0,
    discount: 0
  });

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
       
      <InvoiceForm
        formData={formData}
        setFormData={setFormData}
        onDownloadClick={() => setShowPreview(true)}
      />

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setShowPreview(false)}
            >
              ✖
            </button>
            <InvoicePreview formData={formData} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
