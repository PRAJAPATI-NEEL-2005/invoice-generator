import React, { useState, useEffect } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import Alert from "./components/Alert";
import { FaMoon, FaSun, FaHistory, FaPlus } from "react-icons/fa";

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
  
  const [alert, setAlert] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("create"); // create, history
  const [savedInvoices, setSavedInvoices] = useState([]);
  
  // Load saved invoices from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("savedInvoices");
    if (savedData) {
      setSavedInvoices(JSON.parse(savedData));
    }
    
    // Check for user's preferred theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const showAlert = (msg, type) => {
    setAlert({
      message: msg,
      type: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 3000); // Extended time for better visibility
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const saveInvoice = () => {
    // Create a copy of the current invoice with a timestamp
    const invoiceToSave = {
      ...formData,
      savedAt: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    const updatedInvoices = [...savedInvoices, invoiceToSave];
    setSavedInvoices(updatedInvoices);
    
    // Save to localStorage
    localStorage.setItem("savedInvoices", JSON.stringify(updatedInvoices));
    
    showAlert("Invoice saved successfully!", "success");
  };
  
  const loadInvoice = (invoice) => {
    setFormData(invoice);
    setView("create");
    showAlert("Invoice loaded successfully!", "success");
  };
  
  const deleteInvoice = (id) => {
    const updatedInvoices = savedInvoices.filter(invoice => invoice.id !== id);
    setSavedInvoices(updatedInvoices);
    localStorage.setItem("savedInvoices", JSON.stringify(updatedInvoices));
    showAlert("Invoice deleted successfully!", "info");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"} transition-colors duration-300`}>
      {/* Header */}
      <header className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-orange-500">Invoice</span> Generator
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView("create")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                view === "create" 
                  ? "bg-orange-500 text-white" 
                  : darkMode 
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white" 
                    : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
              }`}
            >
              <FaPlus /> New Invoice
            </button>
            
            <button 
              onClick={() => setView("history")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                view === "history" 
                  ? "bg-orange-500 text-white" 
                  : darkMode 
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white" 
                    : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
              }`}
            >
              <FaHistory /> History
            </button>
            
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-yellow-400 text-gray-900" 
                  : "bg-gray-800 text-yellow-400"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        {view === "create" ? (
          <InvoiceForm
            formData={formData}
            setFormData={setFormData}
            showalert={showAlert}
            onDownloadClick={() => setShowPreview(true)}
            onSaveClick={saveInvoice}
            darkMode={darkMode}
          />
        ) : (
          <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-2xl font-bold mb-4">Saved Invoices</h2>
            
            {savedInvoices.length === 0 ? (
              <p className="text-center py-8">No saved invoices yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedInvoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className={`border rounded-lg p-4 ${
                      darkMode 
                        ? "border-gray-700 hover:border-gray-500" 
                        : "border-gray-200 hover:border-gray-400"
                    } transition-all hover:shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Invoice #{invoice.invoiceInfo.number || "Draft"}</h3>
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(invoice.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p><span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>From:</span> {invoice.sender.name}</p>
                      <p><span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>To:</span> {invoice.receiver.name}</p>
                      <p className="font-medium mt-1">
                        Total: {invoice.currency}
                        {(
                          invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + 
                          (invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0) * (invoice.taxRate / 100)) + 
                          parseFloat(invoice.fees) - 
                          parseFloat(invoice.discount)
                        ).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        onClick={() => loadInvoice(invoice)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteInvoice(invoice.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Alert alert={alert} darkMode={darkMode} />
      
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-lg max-w-4xl w-full relative overflow-y-auto max-h-[90vh]`}>
            <button
              className={`absolute top-2 right-2 ${darkMode ? "text-gray-300" : "text-gray-600"} text-xl hover:text-red-500 transition-colors`}
              onClick={() => setShowPreview(false)}
            >
              ✖
            </button>
            <InvoicePreview formData={formData} darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
