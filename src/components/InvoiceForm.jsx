import React from "react";

const InvoiceForm = ({ formData, setFormData, onDownloadClick,showalert }) => {
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
    newItems[index][field] = field === "name" ? value : parseFloat(value);
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

  return (
  <div className="bg-white rounded shadow-md h-screen overflow-hidden ">
  <div className="flex h-full">
    {/* Left Sticky Sidebar */}
    <div className="w-1/3 p-6 space-y-4 sticky top-0 self-start h-fit">
      <div>
        <label>Tax Rate (%)</label>
        <input
          type="number"
          value={formData.taxRate}
          min="0"
          onChange={(e) =>
            setFormData({ ...formData, taxRate: parseFloat(e.target.value) })
          }
          className="input w-full"
        />
      </div>

      <div>
        <label>Addition Charges({formData.currency})</label>
        <input
          type="number"
          value={formData.fees}
          onChange={(e) =>
            setFormData({ ...formData, fees: parseFloat(e.target.value) })
          }
          className="input w-full"
        />
      </div>

      <div>
        <label>Discount({formData.currency})</label>
        <input
          type="number"
          value={formData.discount}
          onChange={(e) =>
            setFormData({ ...formData, discount: parseFloat(e.target.value) })
          }
          className="input w-full"
        />
      </div>

      <div>
        <label>Currency</label>
        <select
          value={formData.currency}
          onChange={(e) =>
            setFormData({ ...formData, currency: e.target.value })
          }
          className="input w-full"
        >
          <option value="$">USD ($)</option>
          <option value="₹">INR (₹)</option>
          <option value="€">EUR (€)</option>
          <option value="£">GBP (£)</option>
          <option value="¥">JPY (¥)</option>
        </select>
      </div>

      <button
        onClick={onDownload}
        className="w-full mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
      >
        Preview & Download Invoice
      </button>
    </div>

    {/* Right Main Form */}
    <div className="w-2/3 p-6 overflow-y-auto max-h-screen space-y-6 bg-gray-100 rounded-lg scroll-hide">
      {/* Sender & Logo */}
      <div className="flex justify-between items-start">
        <div className="space-y-1 w-full">
          <h3 className="font-bold">Bill From:</h3>
          <input
            type="text"
            placeholder="Your name/business name"
            value={formData.sender.name}
            onChange={(e) => handleChange("sender", "name", e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Your address"
            value={formData.sender.address}
            onChange={(e) => handleChange("sender", "address", e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Your phone number"
            value={formData.sender.phone}
            onChange={(e) => handleChange("sender", "phone", e.target.value)}
            className="input w-full"
          />
          <input
            type="email"
            placeholder="Your email"
            value={formData.sender.email}
            onChange={(e) => handleChange("sender", "email", e.target.value)}
            className="input w-full"
          />
        </div>
       <div className="text-start ml-4">
        {formData.logo && (
    <div className="mt-3">
      <img
        src={formData.logo}
        alt="Uploaded Logo"
        className="h-16 w-auto object-contain border rounded shadow"
      />
    </div>
  )}
  <label className="block text-sm font-medium mb-1">Upload Logo:</label>
   
  <input type="file" accept="image/*" onChange={handleLogoUpload} />

 
</div>
      </div>

      {/* Receiver & Invoice Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <h3 className="font-bold">Bill to:</h3>
          <input
            type="text"
            placeholder="Buyer name/business name"
            value={formData.receiver.name}
            onChange={(e) => handleChange("receiver", "name", e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Buyer address"
            value={formData.receiver.address}
            onChange={(e) => handleChange("receiver", "address", e.target.value)}
            className="input w-full"
          />
          <input
            type="text"
            placeholder="Buyer phone number"
            value={formData.receiver.phone}
            onChange={(e) => handleChange("receiver", "phone", e.target.value)}
            className="input w-full"
          />
          <input
            type="email"
            placeholder="Buyer email"
            value={formData.receiver.email}
            onChange={(e) => handleChange("receiver", "email", e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label className="w-32 text-sm font-medium">Invoice Number:</label>
            <input
              type="text"
              placeholder="Invoice number"
              required
              value={formData.invoiceInfo.number}
              onChange={(e) =>
                handleChange("invoiceInfo", "number", e.target.value)
              }
              className="input flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-32 text-sm font-medium">Invoice Date:</label>
            <input
              type="date"
              value={formData.invoiceInfo.date}
              onChange={(e) =>
                handleChange("invoiceInfo", "date", e.target.value)
              }
              className="input flex-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="w-32 text-sm font-medium">Due Date:</label>
            <input
              type="date"
              value={formData.invoiceInfo.due}
              onChange={(e) =>
                handleChange("invoiceInfo", "due", e.target.value)
              }
              className="input flex-1"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Items</h3>
        <div className="grid grid-cols-4 font-semibold text-white bg-orange-500 rounded py-1 px-2">
          <span>Item</span>
          <span>Quantity</span>
          <span>Price per unit</span>
          <span>Amount</span>
        </div>
        {formData.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center gap-2 border-b py-1"
          >
            <input
              type="text"
              placeholder="Item name"
              required
              value={item.name}
              onChange={(e) =>
                handleItemChange(index, "name", e.target.value)
              }
              className="input"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              min="1"
              required
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="input"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              min="0"
              onChange={(e) =>
                handleItemChange(index, "price", e.target.value)
              }
              className="input"
            />
            <div className="flex items-center justify-between">
              <span>
                {formData.currency}
                {(item.quantity * item.price).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500"
              >
                ✖
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          + Add Item
        </button>
      </div>

      {/* Terms */}
      <div>
        <textarea
          placeholder="Terms and Conditions"
          value={formData.terms}
          onChange={(e) =>
            setFormData({ ...formData, terms: e.target.value })
          }
          className="input w-full mt-4"
        />
      </div>
    </div>
  </div>
</div>

  );
};

export default InvoiceForm;
