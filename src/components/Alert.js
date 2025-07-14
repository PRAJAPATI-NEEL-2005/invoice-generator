import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

function Alert({ alert, darkMode }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (alert) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [alert]);
  
  if (!alert) return null;
  
  const typeClasses = {
    success: {
      light: "bg-green-100 text-green-800 border-green-300",
      dark: "bg-green-900 bg-opacity-40 text-green-200 border-green-700",
      icon: <FaCheckCircle className="mr-2 flex-shrink-0" />
    },
    error: {
      light: "bg-red-100 text-red-800 border-red-300",
      dark: "bg-red-900 bg-opacity-40 text-red-200 border-red-700",
      icon: <FaTimesCircle className="mr-2 flex-shrink-0" />
    },
    warning: {
      light: "bg-yellow-100 text-yellow-800 border-yellow-300",
      dark: "bg-yellow-900 bg-opacity-40 text-yellow-200 border-yellow-700",
      icon: <FaExclamationTriangle className="mr-2 flex-shrink-0" />
    },
    info: {
      light: "bg-blue-100 text-blue-800 border-blue-300",
      dark: "bg-blue-900 bg-opacity-40 text-blue-200 border-blue-700",
      icon: <FaInfoCircle className="mr-2 flex-shrink-0" />
    },
  };
  
  const alertType = alert.type || "info";
  const alertTheme = darkMode ? "dark" : "light";
  const alertClass = typeClasses[alertType][alertTheme];
  const alertIcon = typeClasses[alertType].icon;
  
  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed top-[70px] right-5 z-[9999] min-w-[300px] max-w-[90%] rounded-lg px-5 py-3 text-sm font-medium border shadow-lg transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${alertClass}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {alertIcon}
          <div>
            <div className="font-bold capitalize mb-0.5">{alertType}</div>
            <div className="whitespace-pre-line">{alert.message}</div>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="ml-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <FaTimes />
        </button>
      </div>
      
      <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} h-1 mt-3 rounded-full overflow-hidden`}>
        <div 
          className="bg-current h-full rounded-full animate-shrink"
          style={{ animationDuration: '3s' }}
        ></div>
      </div>
    </div>
  );
}

export default Alert;
