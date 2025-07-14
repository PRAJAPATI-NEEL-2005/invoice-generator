import React, { useState } from "react";
import { FaSave, FaDownload, FaPlus, FaTrash, FaQuestionCircle } from "react-icons/fa";

const InvoiceForm = ({ formData, setFormData, onDownloadClick, showalert, onSaveClick, darkMode }) => {
  const [activeTab, setActiveTab] = useState("details"); // details, items, settings
  const [showHelp, setShowHelp] = useState(false);
  const [templateType, setTemplateType] = useState(null);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const onDownload = () => {
    const {
      sender, receiver, invoiceInfo, items
    } = formData;

    const isEmpty = (value) => !value || value.trim() === '';

    const missingFields = [];

    if (isEmpty(sender.name)) missingFields.push("Sender Name");
    if (isEmpty(sender.address)) missingFields.push("Sender Address");
    if (isEmpty(sender.phone)) missingFields.push("Sender Phone");
    if (isEmpty(sender.email)) missingFields.push("Sender Email");

    if (isEmpty(receiver.name)) missingFields.push("Receiver Name");
    if (isEmpty(receiver.address)) missingFields.push("Receiver Address");
    if (isEmpty(receiver.phone)) missingFields.push("Receiver Phone");
    if (isEmpty(receiver.email)) missingFields.push("Receiver Email");

    if (isEmpty(invoiceInfo.number)) missingFields.push("Invoice Number");
    if (isEmpty(invoiceInfo.date)) missingFields.push("Invoice Date");
    if (isEmpty(invoiceInfo.due)) missingFields.push("Due Date");

    items.forEach((item, index) => {
      if (isEmpty(item.name)) {
        missingFields.push(`Item ${index + 1} Name`);
      }
    });

    if (missingFields.length > 0) {
      showalert(`Please fill in the following fields:\n- ${missingFields.join("\n- ")}`,"error");
      return;
    }
    // continue to download
    onDownloadClick(); // or your modal logic
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === "name" ? value : parseFloat(value) || 0;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (type) => {
    let template = { ...formData };
    
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Common template settings
    template.invoiceInfo = {
      ...template.invoiceInfo,
      date: formatDate(today),
      due: formatDate(dueDate)
    };
    
    if (type === "business") {
      template = {
        ...template,
        terms: "Payment is due within 30 days. Please make the payment via bank transfer or check. Late payment is subject to fees.",
        taxRate: 10,
        fees: 0,
        discount: 0
      };
    } else if (type === "freelance") {
      template = {
        ...template,
        terms: "Payment is due within 14 days. Please make the payment via PayPal or bank transfer.",
        taxRate: 0,
        fees: 0,
        discount: 0
      };
    } else if (type === "retail") {
      template = {
        ...template,
        terms: "Thank you for your business! All sales are final.",
        taxRate: 8.5,
        fees: 0,
        discount: 0
      };
    }
    
    setFormData(template);
    setTemplateType(type);
    showalert(`${type.charAt(0).toUpperCase() + type.slice(1)} template applied!`, "success");
  };

  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const prefix = "INV";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    const invoiceNumber = `${prefix}-${year}${month}-${randomNum}`;
    
    handleChange("invoiceInfo", "number", invoiceNumber);
    showalert("Invoice number generated!", "success");
  };

  const formClasses = darkMode 
    ? "bg-gray-800 text-gray-100 border-gray-700" 
    : "bg-white text-gray-800 border-gray-200";
    
  const inputClasses = darkMode 
    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500" 
    : "bg-white border-gray-300 focus:border-blue-500";
    
  const tabClasses = (tab) => {
    return `px-4 py-2 rounded-t-lg font-medium ${
      activeTab === tab 
        ? (darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800") 
        : (darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600")
    } hover:text-gray-800 dark:hover:text-white cursor-pointer transition-colors`;
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${formClasses}`}>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <div 
          className={tabClasses("details")}
          onClick={() => setActiveTab("details")}
        >
          Invoice Details
        </div>
        <div 
          className={tabClasses("items")}
          onClick={() => setActiveTab("items")}
        >
          Items & Pricing
        </div>
        <div 
          className={tabClasses("settings")}
          onClick={() => setActiveTab("settings")}
        >
          Settings & Options
        </div>
      </div>
      
      <div className="p-6">
        {/* Templates and Actions */}
        <div className="mb-6 flex flex-wrap gap-3 justify-between items-center">
          <div>
            <label className="block text-sm font-medium mb-2">Quick Templates:</label>
            <div className="flex gap-2">
              <button 
                onClick={() => applyTemplate("business")}
                className={`px-3 py-1 text-sm rounded ${templateType === "business" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Business
              </button>
              <button 
                onClick={() => applyTemplate("freelance")}
                className={`px-3 py-1 text-sm rounded ${templateType === "freelance" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Freelance
              </button>
              <button 
                onClick={() => applyTemplate("retail")}
                className={`px-3 py-1 text-sm rounded ${templateType === "retail" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                Retail
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onSaveClick}
              className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              <FaDownload /> Preview
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Help"
            >
              <FaQuestionCircle />
            </button>
          </div>
        </div>
        
        {/* Help Box */}
        {showHelp && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"} border ${darkMode ? "border-gray-600" : "border-blue-200"}`}>
            <h3 className="font-bold mb-2">Quick Help</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fill in all required fields in the Invoice Details and Items tabs</li>
              <li>Use templates to quickly set up common invoice types</li>
              <li>Preview your invoice before downloading</li>
              <li>Save invoices to access them later from the History section</li>
              <li>Customize tax rates, fees, and discounts in the Settings tab</li>
            </ul>
          </div>
        )}

        {activeTab === "details" && (
          <>
            {/* Sender & Logo */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="space-y-4 flex-1">
                <h3 className="font-bold text-lg">Bill From:</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name/Business:</label>
                  <input
                    type="text"
                    placeholder="Your name/business name"
                    value={formData.sender.name}
                    onChange={(e) => handleChange("sender", "name", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Your Address:</label>
                  <textarea
                    placeholder="Your address"
                    value={formData.sender.address}
                    onChange={(e) => handleChange("sender", "address", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                    rows="2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone:</label>
                    <input
                      type="text"
                      placeholder="Your phone number"
                      value={formData.sender.phone}
                      onChange={(e) => handleChange("sender", "phone", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={formData.sender.email}
                      onChange={(e) => handleChange("sender", "email", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <h3 className="font-bold text-lg mb-4">Logo & Branding</h3>
                <div className={`p-4 border rounded-md text-center ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  {formData.logo ? (
                    <div className="mb-3">
                      <img
                        src={formData.logo}
                        alt="Uploaded Logo"
                        className="h-24 w-auto mx-auto object-contain"
                      />
                      <button 
                        onClick={() => setFormData({...formData, logo: null})}
                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className={`h-24 flex items-center justify-center mb-3 border-2 border-dashed rounded ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                      <span className="text-sm text-gray-500 dark:text-gray-400">No logo uploaded</span>
                    </div>
                  )}
                  <label className={`block w-full p-2 text-center border rounded cursor-pointer ${darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-100 border-gray-300 hover:bg-gray-200"}`}>
                    Upload Logo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Receiver & Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Bill To:</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name/Business:</label>
                  <input
                    type="text"
                    placeholder="Client name/business name"
                    value={formData.receiver.name}
                    onChange={(e) => handleChange("receiver", "name", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Client Address:</label>
                  <textarea
                    placeholder="Client address"
                    value={formData.receiver.address}
                    onChange={(e) => handleChange("receiver", "address", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                    rows="2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone:</label>
                    <input
                      type="text"
                      placeholder="Client phone number"
                      value={formData.receiver.phone}
                      onChange={(e) => handleChange("receiver", "phone", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                      type="email"
                      placeholder="Client email"
                      value={formData.receiver.email}
                      onChange={(e) => handleChange("receiver", "email", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Invoice Information</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Invoice Number:</label>
                    <input
                      type="text"
                      placeholder="Invoice number"
                      value={formData.invoiceInfo.number}
                      onChange={(e) => handleChange("invoiceInfo", "number", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                  <button
                    onClick={generateInvoiceNumber}
                    className="mt-6 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Date:</label>
                  <input
                    type="date"
                    value={formData.invoiceInfo.date}
                    onChange={(e) => handleChange("invoiceInfo", "date", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date:</label>
                  <input
                    type="date"
                    value={formData.invoiceInfo.due}
                    onChange={(e) => handleChange("invoiceInfo", "due", e.target.value)}
                    className={`w-full p-2 border rounded-md ${inputClasses}`}
                  />
                </div>
              </div>
            </div>
            
            {/* Terms */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Terms and Conditions:</label>
              <textarea
                placeholder="Terms and Conditions"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className={`w-full p-2 border rounded-md ${inputClasses}`}
                rows="3"
              />
            </div>
          </>
        )}

        {activeTab === "items" && (
          <div>
            <h3 className="font-bold text-lg mb-4">Items</h3>
            
            <div className={`grid grid-cols-12 font-semibold text-white bg-orange-500 rounded-t py-2 px-4`}>
              <span className="col-span-5">Item Description</span>
              <span className="col-span-2">Quantity</span>
              <span className="col-span-2">Price</span>
              <span className="col-span-2">Amount</span>
              <span className="col-span-1"></span>
            </div>
            
            <div className={`border-l border-r ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-12 items-center gap-2 p-3 ${
                    index % 2 === 0 
                      ? (darkMode ? "bg-gray-700" : "bg-gray-50") 
                      : (darkMode ? "bg-gray-800" : "bg-white")
                  }`}
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Item description"
                      required
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      min="1"
                      required
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className={`w-full p-2 border rounded-md ${inputClasses}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">{formData.currency}</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.price}
                        min="0"
                        step="0.01"
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        className={`w-full p-2 pl-7 border rounded-md ${inputClasses}`}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 font-medium">
                    {formData.currency}
                    {(item.quantity * item.price).toFixed(2)}
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={addItem}
                className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FaPlus size={12} /> Add Item
              </button>
              
              <div className={`w-64 p-4 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span>Subtotal:</span>
                  <span className="text-right">
                    {formData.currency}
                    {formData.items
                      .reduce((sum, item) => sum + item.quantity * item.price, 0)
                      .toFixed(2)}
                  </span>
                  
                  <span>Tax ({formData.taxRate}%):</span>
                  <span className="text-right">
                    {formData.currency}
                    {(
                      formData.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      ) *
                      (formData.taxRate / 100)
                    ).toFixed(2)}
                  </span>
                  
                  <span>Fees:</span>
                  <span className="text-right">
                    {formData.currency}
                    {parseFloat(formData.fees).toFixed(2)}
                  </span>
                  
                  <span>Discount:</span>
                  <span className="text-right">
                    -{formData.currency}
                    {parseFloat(formData.discount).toFixed(2)}
                  </span>
                  
                  <span className="font-bold">TOTAL:</span>
                  <span className="text-right font-bold">
                    {formData.currency}
                    {(
                      formData.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      ) +
                      formData.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      ) *
                        (formData.taxRate / 100) +
                      parseFloat(formData.fees) -
                      parseFloat(formData.discount)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Invoice Settings</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Currency:</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className={`w-full p-2 border rounded-md ${inputClasses}`}
                >
                  <option value="$">USD ($)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="A$">AUD (A$)</option>
                  <option value="C$">CAD (C$)</option>
                  <option value="₿">BTC (₿)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tax Rate (%):</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  min="0"
                  step="0.01"
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className={`w-full p-2 border rounded-md ${inputClasses}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Additional Fees ({formData.currency}):</label>
                <input
                  type="number"
                  value={formData.fees}
                  min="0"
                  step="0.01"
                  onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) || 0 })}
                  className={`w-full p-2 border rounded-md ${inputClasses}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Discount ({formData.currency}):</label>
                <input
                  type="number"
                  value={formData.discount}
                  min="0"
                  step="0.01"
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  className={`w-full p-2 border rounded-md ${inputClasses}`}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Tips & Help</h3>
              
              <div className={`p-4 rounded ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
                <h4 className="font-medium mb-2">Invoice Best Practices:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Always include clear payment terms and due dates</li>
                  <li>Number your invoices sequentially for better tracking</li>
                  <li>Include your tax ID or business registration number if applicable</li>
                  <li>Clearly itemize all products or services</li>
                  <li>Consider adding a personal thank you note</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
                <h4 className="font-medium mb-2">Payment Methods to Consider:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Bank transfer</li>
                  <li>PayPal or other online payment services</li>
                  <li>Credit/debit card</li>
                  <li>Check</li>
                  <li>Cash (provide a receipt)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceForm;
